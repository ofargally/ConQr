require('dotenv').config();
import express, { json } from 'express';
import { connect, connection as _connection } from 'mongoose';
import cors from 'cors';
import { require } from 'module';
import process from 'process';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(json());

connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = _connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});