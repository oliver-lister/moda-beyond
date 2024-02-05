import 'dotenv/config';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import multer from 'multer';
import express from 'express';
import path from 'path';
import cors from 'cors';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

// Database Connection With MongoDB
if (process.env.MONGODB) {
  mongoose.connect(process.env.MONGODB);
}

// API Creation
app.get('/', (req, res) => {
  res.send('Express App Is Running');
});

app.listen(port, () => {
  console.log('Server running on port ' + port);
});

app.listen(port).on('error', (err) => {
  console.log('Error: ' + err);
});

// https://www.youtube.com/watch?v=y99YgaQjgx4&t=18379s 5:15:31
