import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import mongoose from 'mongoose';

import productRoutes from './routes/productRoutes/productRoutes';
import userRoutes from './routes/userRoutes/userRoutes';
import authRoutes from './routes/authRoutes/authRoutes';
import checkoutRoutes from './routes/checkoutRoutes/checkoutRoutes';
import cookieParser from 'cookie-parser';
import { cookieJWTAuth } from './middleware/cookieJWTAuth';
import { checkUserAccess } from './middleware/checkUserAccess';

const app = express();
export const port = process.env.PORT;

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/products', productRoutes);
app.use('/user/:userId', cookieJWTAuth, checkUserAccess, userRoutes);
app.use('/auth', authRoutes);
app.use('/checkout', checkoutRoutes);

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
