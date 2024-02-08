import 'dotenv/config';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import multer from 'multer';
import express from 'express';
import path from 'path';
import cors from 'cors';
import * as fs from 'fs';

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

// Image Storage Engine
// ... I plan to add API conversion to WEBP before storage

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const productId = (req.params.productId || 'defaultProductId').replace(':', '');

      const folderPath = `./upload/images/${productId}`;

      if (!fs.existsSync(folderPath)) {
        // If the directory doesn't exist, create it
        fs.mkdirSync(folderPath, { recursive: true });
      }

      cb(null, folderPath);
    } catch (error) {
      console.log(error);
    }
  },
  filename: (req, file, cb) => {
    const filename = `${file.fieldname}_${req.params.productId}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

// Creating Upload Endpoint for Images

app.use('/images', express.static('upload/images'));

app.post('/upload/:productId', upload.array('product'), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.json({
      success: 0,
      message: 'No files uploaded.',
    });
  }

  const imageUrls: string[] = (req.files as Express.Multer.File[]).map(
    (img: Express.Multer.File) => `http://localhost:${port}/images/${req.params.productId}/${img.filename}`,
  );

  res.json({
    success: 1,
    image_url: imageUrls,
  });
});

// Schema for Creating Products

// const Product = mongoose.model('Product', {
//   id: { type: Number, require: true },
// });

app
  .listen(port, () => {
    console.log('Server running on port ' + port);
  })
  .on('error', (err) => {
    console.log('Error: ' + err);
  });

// https://www.youtube.com/watch?v=y99YgaQjgx4&t=18379s 5:15:31
