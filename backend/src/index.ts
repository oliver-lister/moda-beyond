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
app.use(express.urlencoded({ extended: true }));
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

const tempStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      // store image files in a temporary directory which later renames to mongoDB id
      const folderPath = `./upload/images/tempDir`;

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
    const filename = `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

const tempUpload = multer({ storage: tempStorage });

// Schema for Creating Products

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  availableSizes: { type: [String], required: true },
  material: { type: String },
  price: { type: Number, required: true },
  lastPrice: { type: Number },
  images: { type: [String], default: [] },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

// Model for the Product schema
const Product = mongoose.model('Product', productSchema);

// API for Product Creation & Image Upload
app.post('/addproduct', tempUpload.array('product'), async (req, res) => {
  try {
    const newProductData = req.body;
    const newProduct = await Product.create(newProductData);

    const tempPath = './upload/images/tempDir';
    const newPath = `./upload/images/${newProduct.id}`;

    fs.rename(tempPath, newPath, (err) => (err ? console.log(err) : console.log('Successfully renamed the directory with Product Id.')));

    // Update the product with image URLs
    const imageUrls = (req.files as Express.Multer.File[]).map(
      (img: Express.Multer.File) => `http://localhost:${port}/images/${newProduct.id}/${img.filename}`,
    );

    newProduct.images = imageUrls;

    await newProduct.save(); // save new product to MongoDB

    res.json({
      success: 1,
      product: newProduct,
    });
  } catch (err) {
    res.json({
      success: 0,
      error: err,
    });
  }
});

// API for Product Removal

app.post('/removeproduct', async (req, res) => {
  try {
    const id = req.body.id;
    await Product.findOneAndDelete({ _id: id });

    const imageFolderPath = `./upload/images/${id}`;

    // Remove local image file folder
    fs.rmSync(imageFolderPath, { recursive: true, force: true });

    console.log('Product removed: ' + id);
    res.json({
      success: 1,
      name: `${id} deleted`,
    });
  } catch (err) {
    res.json({
      success: 0,
      error: err,
    });
  }
});

// API for Fetching Products with Dynamic Filtering

app.get('/fetchproducts', async (req, res) => {
  try {
    const queryFilter = req.query ? req.query : {};
    const products = await Product.find(queryFilter);
    res.send(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server

app
  .listen(port, () => {
    console.log('Server running on port ' + port);
  })
  .on('error', (err) => {
    console.log('Error: ' + err);
  });
