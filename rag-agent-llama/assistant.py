import ollama
import chromadb
import psycopg
import os
import ast
from dotenv import load_dotenv
from psycopg.rows import dict_row
from tqdm import tqdm
from colorama import Fore
load_dotenv()

db_user = os.getenv('DB_USER')
db_password = os.getenv('DB_PASSWORD')
db_host = os.getenv('DB_HOST')
db_port = os.getenv('DB_PORT')
db_name = os.getenv('DB_NAME')

client = chromadb.Client()
system_prompt = (
    'You are an AI assistant that has memory of every conversation you have ever had with this user. '
    'On every prompt from the user, the system has checked for any relevant messages you have had with the user. '
    'If any embedded previous conversations are attached, use them for context to responding to the user, '
    'if the context is relevant and useful to responding. If the recalled conversations are irrelevant, '
    'disregard speaking about them and respond normally as an AI assistant. Do not talk about recalling conversations. '
    'Just use any useful data from the previous conversations and respond normally as an intelligent AI assistant.'
)


convo = [{'role': 'system', 'content': system_prompt}]
DB_PARAMS = {
    'dbname': db_name,
    'user' : db_user,
    'password' : db_password,
    'host' : db_host,
    'port' : db_port
}

def connect_db():
    conn = psycopg.connect(**DB_PARAMS)
    return conn

def fetch_conversations():
    conn = connect_db()
    with conn.cursor(row_factory=dict_row) as cursor:
        cursor.execute('SELECT * FROM conversations')
        conversations = cursor.fetchall()
    conn.close()
    return conversations

def store_conversations(prompt, response):
    conn = connect_db()
    with conn.cursor() as cursor:
        cursor.execute('INSERT INTO conversations (timestamp, prompt, response) VALUES (CURRENT_TIMESTAMP, %s, %s)', 
            (prompt, response)
        )
        conn.commit()
    conn.close()

def remove_last_conversation():
    conn = connect_db()
    with conn.cursor() as cursor:
        cursor.execute('DELETE FROM conversations WHERE id = (SELECT MAX(id) FROM conversations)')
        conn.commit()
    conn.close()

def stream_response(prompt):
    response = ''
    stream = ollama.chat(model='llama3.1', messages=convo, stream=True)
    print(Fore.LIGHTGREEN_EX + f"\nAssistant: ", end='')
    for chunk in stream:
        content = chunk['message']['content']
        response += content
        print(content, end='', flush=True)
    print('\n')
    store_conversations(prompt=prompt, response=response)
    convo.append({'role': 'assistant', 'content': response})

def create_vector_db(conversations):
    vector_db_name = 'conversations'

    try:
        client.delete_collection(name=vector_db_name)
    except ValueError:
        pass

    vector_db = client.create_collection(name=vector_db_name)

    for convo in conversations:
        serialized_convo = f"prompt: {convo['prompt']} response: {convo['response']}"
        response = ollama.embeddings(model='nomic-embed-text', prompt=serialized_convo)
        embedding = response['embedding']

        vector_db.add(
            ids = [str(convo['id'])],
            embeddings = [embedding],
            documents=[serialized_convo]
        )

def update_vector_db():
    conn = connect_db()
    vector_db = client.get_collection(name='conversations')
    with conn.cursor(row_factory=dict_row) as cursor:
        chroma_ids = vector_db.get()['ids']
        max_id = max(int(id) for id in chroma_ids) if chroma_ids else 0
        cursor.execute('SELECT * FROM conversations WHERE id > %s ORDER BY id', (max_id,))
        new_conversations = cursor.fetchall()
    
    conn.close()
    for convo in new_conversations:
        serialized_convo = f"prompt: {convo['prompt']} response: {convo['response']}"
        response = ollama.embeddings(model='nomic-embed-text', prompt=serialized_convo)
        embedding = response['embedding']
        vector_db.add(
            ids=[str(convo['id'])],
            embeddings=[embedding],
            documents=[serialized_convo]
        )
    print(f"Added {len(new_conversations)} new conversations to the vector database.")

def retrieve_embdedding(queries, result_per_query=2):
    embdeddings = set()
    for query in tqdm(queries, desc='Processing Queries to Vector Database'):
        response = ollama.embeddings(model='nomic-embed-text', prompt=query)
        query_embedding = response['embedding']
        vector_db = client.get_collection(name='conversations')
        result = vector_db.query(query_embeddings=[query_embedding], n_results=result_per_query)
        best_embeddings = result['documents'][0]
        for best in best_embeddings:
            if best not in embdeddings:
                if 'yes' in classify_embeddings(query=query, context=best):
                    embdeddings.add(best)
    print(Fore.LIGHTMAGENTA_EX + f"\n Final Embeddings: {embdeddings}")
    return embdeddings

def create_queries(prompt):
    query_msg = (
        'You are a first principle reasoning search query AI agent. '
        'Your list of search queries will be ran on an embedding database of all your conversations '
        'you have ever had with the user. With first principles create a Python list of queries to '
        'search the embeddings database for any data that would be necessary to have access to in '
        'order to correctly respond to the prompt. Your response must be a Python list with no syntax errors. '
        'Do not explain anything and do not ever generate anything but a perfect syntax Python list'
    )
    query_convo = [
        {'role': 'system', 'content': query_msg},
        {'role': 'user', 'content': 'Write an email to my car insurance company and create a persuasive request for them to lower my rate.'},
        {'role': 'assistant', 'content': '["What is the user\'s name?", "What is the user\'s current auto insurance provider?", "What the monthly rate the user currently pays for auto insurance?"]'},
        {'role': 'user', 'content': 'how can i convert the speak function in my llama3 python voice assistant to use pyttsx3 instead of openai TTS?'},
        {'role': 'assistant', 'content': '["llama3 voice assistant", "Python voice assistant", "OpenAI TTS", "openai speak", "pyttsx3"]'},
        {'role': 'user', 'content': prompt}
    ]   
    response = ollama.chat(model='llama3.1', messages=query_convo)
    print(Fore.YELLOW + f"\nVector Database Queries: {response['message']['content']}\n")
    try:
        return ast.literal_eval(response['message']['content'])
    except:
        return [prompt]
    
def classify_embeddings(query, context):
    classify_msg = (
        'You are an embedding classification AI agent. Your input will be a prompt and one embedded chunk of text. '
        'You will not respond as an AI assistant. You only respond "yes" or "no". '
        'Determine whether the context contains data that directly is related to the search query. '
        'If the context is seemingly exactly what the search query needs, respond "yes" and if it is anything but directly '
        'related respond "no". Do NOT respond "yes" unless the content is highly relevant to the search query.'
    )
    classify_convo = [
        {'role': 'system', 'content': classify_msg},
        {'role': 'user', 'content': 'SEARCH QUERY: What is the users name? \n\nEMBEDDED CONTEXT: You are AI Austin. How can I help you today?'},
        {'role': 'assistant', 'content': 'yes'},
        {'role': 'user', 'content': 'SEARCH QUERY: Llama3 Python Voice Assistant \n\nEMBEDDED CONTEXT: Siri is a voice assistant developed by Apple.'},
        {'role': 'assistant', 'content': 'no'},
        {'role': 'user', 'content': f'SEARCH QUERY: {query} \n\nEMBEDDED CONTEXT: {context}'}
    ]
    response = ollama.chat(model='llama3.1', messages=classify_convo)
    return response['message']['content'].strip().lower()

def recall(prompt):
    queries = create_queries(prompt=prompt)
    embeddings = retrieve_embdedding(queries=queries)
    convo.append({'role': 'user', 'content': f'MEMORIES: {embeddings} \n\n USER PROMPT: {prompt}'})
    print(f'\n{len(embeddings)} message response embeddings added for context.')


def print_chromadb_contents():
    vector_db = client.get_collection(name='conversations')
    results = vector_db.get()
    
    if not results['ids']:
        print("The ChromaDB collection is empty.")
        return

    print("\nContents of ChromaDB collection:")
    print("=================================")
    
    for id, document in zip(results['ids'], results['documents']):
        print(f"ID: {id}")
        print(f"Document: {document}")
        print("---------------------------------")

    print(f"Total documents in ChromaDB: {len(results['ids'])}")

conversations = fetch_conversations()
create_vector_db(conversations=conversations)

while True:
    prompt = input(Fore.WHITE + "User: ")
    if prompt[:7].lower() == '/recall':
        prompt = prompt[8:]
        recall(prompt=prompt)
        stream_response(prompt=prompt)
    elif prompt[:7].lower() == '/forget':
        remove_last_conversation()
        convo = convo[:-1]
        print(Fore.RED + '\nLast conversation removed.\n')
    elif prompt[:9].lower() == '/memorize':
        prompt = prompt[10:]
        store_conversations(prompt=prompt, response='Memory stored.')
        print(Fore.BLUE + '\nConversation Stored\n')
    elif prompt[:5].lower() == '/exit':
        break
    elif prompt.lower() == '/show_chroma':
        print_chromadb_contents()
    else:
        convo.append({'role': 'user', 'content': prompt})
        stream_response(prompt=prompt)
    update_vector_db()