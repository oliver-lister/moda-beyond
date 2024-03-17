import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import mongoose from 'mongoose';

import productRoutes from './routes/productRoutes/productRoutes';
import userRoutes from './routes/userRoutes/userRoutes';
import authRoutes from './routes/authRoutes/authRoutes';

const app = express();
export const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.use('/images', express.static('./upload/images'));

if (process.env.MONGODB) {
  mongoose.connect(process.env.MONGODB);
}

app
  .listen(port, () => {
    console.log('Server running on port ' + port);
  })
  .on('error', (err) => {
    console.log('Error: ' + err);
  });
