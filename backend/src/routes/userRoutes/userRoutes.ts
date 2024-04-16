import { JwtPayload } from 'jsonwebtoken';
import 'dotenv/config';
import { authorizeJWT } from '../../middleware/authMiddleware';
import express, { Request, Response } from 'express';
import { User, Product } from '../../models/models';
import 'dotenv/config';

const router = express.Router();

export interface AuthorizedRequest extends Request {
  user?: JwtPayload | string;
}

// API for fetching user data
router.get('/:userId/fetchdata', authorizeJWT, async (req: AuthorizedRequest, res: Response) => {
  try {
    const userId = req.params.userId;

    if (!req.user || typeof req.user === 'string') {
      return res.status(403).json({ success: false, error: 'You do not have permission to access this resource.', errorCode: 'FORBIDDEN_ACCESS' });
    }

    const tokenUserId = req.user.userId;

    if (userId !== tokenUserId) {
      return res.status(403).json({ success: false, error: 'You do not have permission to access this resource.', errorCode: 'FORBIDDEN_ACCESS' });
    }

    console.log(userId);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not be found in database', errorCode: 'USER_NOT_FOUND' });
    }

    return res.status(200).json({ success: true, message: 'User data successfully fetched', user });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

// API for updating a user's account details
router.patch('/:userId/update', authorizeJWT, async (req: AuthorizedRequest, res: Response) => {
  try {
    const newUserDetails = req.body;
    const userId = req.params.userId;

    if (!req.user || typeof req.user === 'string') {
      return res.status(403).json({ success: false, error: 'You do not have permission to access this resource.', errorCode: 'FORBIDDEN_ACCESS' });
    }

    const tokenUserId = req.user.userId;

    if (userId !== tokenUserId) {
      return res.status(403).json({ success: false, error: 'You do not have permission to access this resource.', errorCode: 'FORBIDDEN_ACCESS' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { ...newUserDetails },
      {
        new: true,
      },
    );

    return res.status(201).json({ success: true, message: 'User updated successfully', user });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

// API for updating a user's cart
router.put('/:userId/cart/update', authorizeJWT, async (req: AuthorizedRequest, res: Response) => {
  try {
    const { newCart } = req.body;
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not be found in database', errorCode: 'USER_NOT_FOUND' });
    }

    user.cart = newCart;

    await user.save();

    return res.status(201).json({ success: true, message: 'Cart updated successfully', cart: user.cart });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

export default router;
