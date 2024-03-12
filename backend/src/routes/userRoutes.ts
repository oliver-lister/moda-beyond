import express, { Request, Response, NextFunction } from 'express';
import { User, Product, Session } from '../models/models';
import { authorizeJWT } from '../middleware/authMiddleware';
import jwt, { JwtPayload } from 'jsonwebtoken';
import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

const generateAccessToken = (userId: any, expiryTime: string) => {
  try {
    if (!process.env.JWT_ACCESS_TOKEN_SECRET) {
      throw new Error('JWT secret could not be found or accessed.');
    }
    return jwt.sign({ userId: userId }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: expiryTime });
  } catch ({ err }: any) {
    console.log('Error: ' + err.message);
  }
};

const generateRefreshToken = () => {
  return uuidv4().replace(/-/g, '');
};

// API for User Registration
router.post('/signup', async (req, res) => {
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
    const accessToken = generateAccessToken(newUser._id, '5m');
    const refreshToken = generateRefreshToken();

    const newSession = new Session({ userId: newUser._id, refreshToken: refreshToken });

    newSession.save();

    return res.status(200).json({ success: 1, message: 'User registered successfully.', accessToken, refreshToken, newUser });
  } catch (err: any) {
    return res.status(400).json({ success: 0, error: err.message });
  }
});

// API for User Login
router.post('/login', async (req: Request, res: Response) => {
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
    const accessToken = generateAccessToken(user._id, '5m');
    const refreshToken = generateRefreshToken();

    const newSession = new Session({ userId: user._id, refreshToken: refreshToken });

    newSession.save();

    return res.status(200).json({ success: 1, message: 'Login successful', accessToken, refreshToken, user });
  } catch (err) {
    return res.status(401).json({ success: 0, error: err });
  }
});

interface AuthorizedRequest extends Request {
  user?: string | JwtPayload;
}

// API for fetching user data
router.get('/fetchuser', authorizeJWT, async (req: AuthorizedRequest, res: Response) => {
  try {
    const userId = req.query.userId;
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

router.post('/refreshtoken', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: 0, error: 'Missing refresh token' });
    }

    const session = await Session.findOne({ refreshToken: refreshToken });

    if (!session) {
      return res.status(401).json({ success: 0, error: 'Missing session information' });
    }

    const userId = session.userId;

    const user = await User.findById(userId);

    // Generate a new access token
    const newAccessToken = generateAccessToken(userId, '5m');
    const newRefreshToken = generateRefreshToken();

    console.log('newRefreshToken: ' + newRefreshToken);

    // Update session

    session.updatedAt = new Date();
    session.refreshToken = newRefreshToken;

    await session.save();

    console.log('Updated Session: ' + session);

    return res.json({ success: 1, newAccessToken, newRefreshToken, user });
  } catch (err) {
    console.error('Error refreshing access token:', err);
    return res.status(401).json({ success: 0, error: 'Invalid refresh token' });
  }
});

// API for adding a product to the user's cart
router.post('/addtocart', authorizeJWT, async (req: AuthorizedRequest, res: Response) => {
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
router.post('/removefromcart', authorizeJWT, async (req: AuthorizedRequest, res: Response) => {
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

export default router;
