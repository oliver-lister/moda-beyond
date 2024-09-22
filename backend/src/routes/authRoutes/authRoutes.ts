import express, { Request, Response } from 'express';
import { User, Session, UserDocument } from '../../models/models';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
import { AuthorizedRequest } from '../userRoutes/userRoutes';

const router = express.Router();

const generateAccessToken = (userId: string, expiryTime: string) => {
  const tokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
  if (!tokenSecret) {
    throw new Error('JWT secret could not be found or accessed.');
  }
  try {
    return jwt.sign({ userId: userId }, tokenSecret, { expiresIn: expiryTime });
  } catch (err: any) {
    throw err;
  }
};

const generateRefreshToken = () => {
  try {
    return uuidv4().replace(/-/g, '');
  } catch (err: any) {
    throw err;
  }
};

// API for User Registration
router.post('/signup', async (req: Request, res: Response) => {
  try {
    // Check if the user already exists
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(409).json({ success: false, error: 'Existing user found with the same email address.', errorCode: 'EXISTING_USER_CONFLICT' });
    }

    // Create a new user instance
    const passwordHash = req.body.password;
    const newUserData = { ...req.body, passwordHash };
    const newUser = new User(newUserData);

    // Save the new user to the database
    await newUser.save();

    // Generate a JWT token for authentication
    const accessToken = generateAccessToken(String(newUser._id), '5m');
    const refreshToken = generateRefreshToken();

    // Create a new authentication session in MongoDB
    const newSession = new Session({ userId: newUser._id, refreshToken: refreshToken });
    newSession.save();

    const userId = String(newUser._id);

    return res.status(200).json({ success: true, message: 'User registered successfully.', accessToken, refreshToken, userId });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

// API for User Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    // Check if the user exists
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found', errorCode: 'USER_NOT_FOUND' });
    }

    const isPasswordValid = await user.validPassword(req.body.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Password provided was incorrect', errorCode: 'INVALID_PASSWORD' });
    }

    // Generate a JWT token for authentication
    const accessToken = generateAccessToken(String(user._id), '5m');
    const refreshToken = generateRefreshToken();

    const newSession = new Session({ userId: user._id, refreshToken: refreshToken });

    newSession.save();

    const userId = String(user._id);

    return res.status(200).json({ success: true, message: 'Login successful', accessToken, refreshToken, userId });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

// API for refreshing JWT accessToken

router.post('/refreshtoken', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, error: 'Missing refresh token', errorCode: 'MISSING_REFRESH_TOKEN' });
    }

    const session = await Session.findOne({ refreshToken: refreshToken });

    if (!session) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token: missing session information',
        errorCode: 'MISSING_SESSION_INFORMATION',
      });
    }

    const userId = session.userId.toString();

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found', errorCode: 'USER_NOT_FOUND' });
    }

    // Generate a new access token
    const newAccessToken = generateAccessToken(userId.toString(), '5m');
    const newRefreshToken = generateRefreshToken();

    // Update session
    session.updatedAt = new Date();
    session.refreshToken = newRefreshToken;
    await session.save();

    return res.status(200).json({ success: true, message: 'Access token successfully refreshed', newAccessToken, newRefreshToken, userId });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

// API for clearing out sessions in database
router.delete('/clearsessions', async (req: AuthorizedRequest, res: Response) => {
  try {
    // Delete all sessions
    await Session.deleteMany({});

    return res.status(204).send();
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

export default router;
