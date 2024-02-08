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
      const productId = req.body.id;

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
    const filename = `${file.fieldname}_${req.body.id}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

// Schema for Creating Products

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  image: { type: [String], default: [] },
  name: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  lastPrice: { type: Number },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

// Model for the Product schema
const Product = mongoose.model('Product', productSchema);

// Creating Combined Endpoint for Images Upload and Product Creation
app.post('/addproduct', upload.array('product'), async (req, res) => {
  try {
    const newProductData = req.body;
    const newProduct = await Product.create(newProductData);

    // Update the product with image URLs
    const imageUrls = (req.files as Express.Multer.File[]).map(
      (img: Express.Multer.File) => `http://localhost:${port}/images/${req.params.productId}/${img.filename}`,
    );
    newProduct.image = imageUrls;

    await newProduct.save(); // save new product to MongoDB

    res.json({
      success: 1,
      product: newProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: 0,
      message: 'Internal server error',
    });
  }
});

app
  .listen(port, () => {
    console.log('Server running on port ' + port);
  })
  .on('error', (err) => {
    console.log('Error: ' + err);
  });

// https://www.youtube.com/watch?v=y99YgaQjgx4&t=18379s 5:15:31
