import 'dotenv/config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import mongoose, { Document } from 'mongoose';
import multer from 'multer';
import express, { Request, Response, NextFunction } from 'express';
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

app.get('/fetchproducts', async (req: Request, res: Response) => {
  try {
    const queryFilter = req.query ? req.query : {};

    const products = await Product.find(queryFilter);
    res.send(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API for Fetching Product by Id
app.get('/fetchproductbyid/:productId', async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;

    // Convert productId to ObjectId
    const objectId = new mongoose.Types.ObjectId(productId);

    const product = await Product.findOne({ _id: objectId });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.send(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Schema for Cart Item
const cartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
  quantity: { type: Number, default: 1 },
});

// Schema for User

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: Date,
  address: { street: String, city: String, zipCode: String },
  shoppingPreference: { type: String, required: true },
  newsletter: { type: Boolean, required: true, default: true },
  cart: [cartItemSchema],
});

// Model for the User schema
const User = mongoose.model<UserDocument>('Users', userSchema);

// Define the UserDocument interface
interface UserDocument extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob?: Date;
  address?: { street: string; city: string; zipCode: string };
  shoppingPreference: string;
  newsletter: boolean;
  cart: CartItem[];
}

// Define the CartItem interface
interface CartItem {
  _id?: string;
  productId: string;
  size?: string;
  color?: string;
  quantity?: number;
}

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
    const accessToken = jwt.sign({ userId: newUser._id }, 'secret_ecom', { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: newUser._id }, 'secret_ecom_refresh', { expiresIn: '1h' });

    return res.status(200).json({ success: 1, message: 'User registered successfully.', accessToken, refreshToken, newUser });
  } catch (err: any) {
    return res.status(400).json({ success: 0, error: err.message });
  }
});

// API for User Login

app.post('/login', async (req: Request, res: Response) => {
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
    const accessToken = jwt.sign({ userId: user._id }, 'secret_ecom', { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: user._id }, 'secret_ecom_refresh', { expiresIn: '1h' });

    return res.status(200).json({ success: 1, message: 'Login successful', accessToken, refreshToken, user });
  } catch (err) {
    return res.status(401).json({ success: 0, error: err });
  }
});

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

// JWT Authentication Middleware
const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.header('accessToken');

  if (!token) {
    return res.status(401).json({ success: 0, error: 'Access Denied - Missing Token' });
  }

  try {
    const decoded = jwt.verify(token, 'secret_ecom');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return res.status(403).json({ success: 0, error: 'Access Denied - Invalid Token' });
  }
};

// API for fetching user data
app.get('/fetchuser', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.user as { userId: string };
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: 0, error: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    console.error('Fetch user data error:', error);
    return res.status(500).json({ success: 0, error: 'Internal Server Error' });
  }
});

// API for refreshing JWT accessToken

app.post('/refreshtoken', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: 0, error: 'Missing refresh token' });
    }

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, 'secret_ecom_refresh');
    const userId = (decoded as { userId: string }).userId;
    const user = await User.findById(userId);

    // Generate a new access token
    const accessToken = jwt.sign({ userId: userId }, 'secret_ecom', { expiresIn: '1h' });
    const newRefreshToken = jwt.sign({ userId: userId }, 'secret_ecom_refresh', { expiresIn: '1h' });

    res.json({ success: 1, accessToken, newRefreshToken, user });
  } catch (err) {
    console.error('Error refreshing access token:', err);
    return res.status(401).json({ success: 0, error: 'Invalid refresh token' });
  }
});

// API for adding a product to the user's cart
app.post('/addtocart', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { productId, color, quantity, size } = req.body;

    const { userId } = req.user as { userId: string };
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(404).json({ success: 0, error: 'User or product not found' });
    }

    user.cart.push({ productId, color, quantity, size });

    await user.save();

    return res.json({ success: 1, message: 'Product added to the cart successfully', user });
  } catch (err: any) {
    console.error('Error adding product to cart:', err.message);
    return res.status(500).json({ success: 0, error: err.message });
  }
});

// API for removing a product from the user's cart
app.post('/removefromcart', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { cartItemId } = req.body;

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ success: 0, error: 'User not found' });
    }
    user.cart = user.cart.filter((item) => item._id !== cartItemId);

    await user.save();

    return res.json({ success: 1, message: 'Product removed from the cart successfully', user });
  } catch (err: any) {
    return res.status(500).json({ success: 0, error: err.message });
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
