import pyperclip
def get_clipboard_text():
    clipboard_content = pyperclip.paste()
    if isinstance(clipboard_content, str):
        return clipboard_content
    else:
        print('No text found on clipboard') 
        return None

print(get_clipboard_text())

