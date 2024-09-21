import { JwtPayload } from 'jsonwebtoken';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import { User } from '../../models/models';
import cartRoutes from './cartRoutes/cartRoutes';

const userRouter = express.Router();
userRouter.use('/:userId/cart', cartRoutes);

export interface AuthorizedRequest extends Request {
  user?: JwtPayload | string;
}

// API for fetching user data
userRouter.get('/:userId/fetchdata', async (req: AuthorizedRequest, res: Response) => {
  try {
    const userId = req.params.userId;

    if (!req.user || typeof req.user === 'string' || userId !== req.user.userId) {
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
userRouter.put('/:userId/update', async (req: AuthorizedRequest, res: Response) => {
  try {
    const newUserDetails = req.body;
    const userId = req.params.userId;

    if (!req.user || typeof req.user === 'string' || userId !== req.user.userId) {
      return res.status(403).json({ success: false, error: 'You do not have permission to access this resource.', errorCode: 'FORBIDDEN_ACCESS' });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { $set: newUserDetails }, { new: true });

    if (!updatedUser) return res.status(404).json({ success: false, error: 'User not be found in database', errorCode: 'USER_NOT_FOUND' });

    if (req.body.password) {
      updatedUser.passwordHash = req.body.password;
      await updatedUser.save();
    }

    return res.status(201).json({ success: true, message: 'User updated successfully', user: updatedUser });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

// API for updating a user's account details
userRouter.delete('/:userId/delete', async (req: AuthorizedRequest, res: Response) => {
  try {
    const userId = req.params.userId;

    if (!req.user || typeof req.user === 'string' || userId !== req.user.userId) {
      return res.status(403).json({ success: false, error: 'You do not have permission to access this resource.', errorCode: 'FORBIDDEN_ACCESS' });
    }

    User.deleteOne({ id: userId });

    return res.status(201).json({ success: true, message: 'User deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

export default userRouter;
