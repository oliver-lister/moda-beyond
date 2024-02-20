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
app.use('/images', express.static('./upload/images'));
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
  category: { type: String, required: true, enum: ['men', 'women', 'kids'] },
  brand: { type: String, required: true },
  availableSizes: { type: [String], required: true },
  availableColors: { type: [{ label: String, hex: String }], required: true },
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
app.post('/addproduct', tempUpload.array('productImg'), async (req, res) => {
  try {
    const newProductData = {
      name: req.body.name,
      category: req.body.category,
      brand: req.body.brand,
      availableSizes: JSON.parse(req.body.availableSizes),
      availableColors: JSON.parse(req.body.availableColors),
      material: req.body.material,
      price: req.body.price,
    };

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

// Schema for Creating Users

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: Date },
  shoppingPreference: { type: String, required: true },
  newsletter: { type: Boolean, required: true, default: true },
  cart: { type: Object, default: { items: [], productTotal: 0, totalQuantity: 0 } },
});

// Model for the User schema
const User = mongoose.model('Users', userSchema);

// API for User Registration

app.post('/signup', async (req, res) => {
  try {
    // Check if the user already exists
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      throw new Error('Existing user found with the same email address.');
    }

    // Create a new user instance
    const newUserData = req.body;
    const newUser = new User(newUserData);

    // Save the new user to the database
    await newUser.save();

    // Generate a JWT token for authentication
    const token = jwt.sign({ userId: newUser._id }, 'secret_ecom', { expiresIn: '1h' });

    return res.status(200).json({ success: 1, message: 'User registered successfully.', token });
  } catch (err: any) {
    return res.status(400).json({ success: 0, error: err.message });
  }
});

// API for User Login

app.post('/login', async (req, res) => {
  try {
    // Check if the user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error('User not found.');
    }

    const isPasswordValid = req.body.password === user.password;

    if (!isPasswordValid) {
      throw new Error('Incorrect password.');
    }

    // Generate a JWT token for authentication
    const token = jwt.sign({ userId: user._id }, 'secret_ecom', { expiresIn: '1h' });

    // You can customize the response based on your needs
    return res.status(200).json({ success: 1, message: 'Login successful', token });
  } catch (err) {
    return res.status(401).json({ success: 0, error: err });
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
