import express, { Request, Response } from 'express';
import { User, Session, UserDocument } from '../../models/models';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
import { AuthorizedRequest } from '../userRoutes/userRoutes';
import { cookieJWTAuth } from '../../middleware/cookieJWTAuth';

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

// API for retrieving Auth session
router.get('/session', cookieJWTAuth, async (req: AuthorizedRequest, res: Response) => {
  if (!req.user || typeof req.user === 'string') {
    return res.status(401).json({ success: false, message: 'User not authenticated', errorCode: 'USER_NOT_AUTHENTICATED' });
  }

  const userId = req.user.userId;

  const user = await User.findById(userId);

  return res.status(200).json({
    success: true,
    message: 'Authentication successful',
    user,
  });
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
    const accessToken = generateAccessToken(String(user._id), '1h');
    res.cookie('accessToken', accessToken, { httpOnly: true });

    const refreshToken = generateRefreshToken();
    const newSession = new Session({ userId: String(user._id), refreshToken: refreshToken });
    await newSession.save();
    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    return res.status(200).json({ success: true, message: 'Login successful', user });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

// API for User Logout
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({ success: false, error: 'No refresh token provided', errorCode: 'NO_REFRESH_TOKEN' });
    }

    // Remove the session associated with the refresh token from the database
    const deletedSession = await Session.findOneAndDelete({ refreshToken });

    if (!deletedSession) {
      return res.status(404).json({ success: false, error: 'Session not found', errorCode: 'SESSION_NOT_FOUND' });
    }

    // Clear the cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.status(200).json({ success: true, message: 'Logout successful' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

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

    const accessToken = generateAccessToken(String(newUser._id), '1h');
    res.cookie('accessToken', accessToken, { httpOnly: true });

    const refreshToken = generateRefreshToken();
    const newSession = new Session({ userId: String(newUser._id), refreshToken: refreshToken });
    await newSession.save();
    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    return res.status(200).json({ success: true, message: 'User registered successfully.', user: newUser });
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
