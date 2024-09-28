import { JwtPayload } from 'jsonwebtoken';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import { User, UserDocument } from '../../models/models';
import cartRoutes from './cartRoutes/cartRoutes';

const userRouter = express.Router({ mergeParams: true });
userRouter.use('/cart', cartRoutes);

export interface AuthorizedRequest extends Request {
  user?: JwtPayload | string;
}

// API for fetching user data
userRouter.get('/', async (req: AuthorizedRequest, res: Response) => {
  try {
    const userId = req.params.userId;
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
userRouter.put('/', async (req: AuthorizedRequest, res: Response) => {
  try {
    const newUserDetails = req.body;
    const userId = req.params.userId;

    const { street, suburb, state, postcode } = newUserDetails;
    if (street || suburb || state || postcode) newUserDetails.address = { street, suburb, state, postcode };

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
userRouter.delete('/', async (req: AuthorizedRequest, res: Response) => {
  try {
    const userId = req.params.userId;
    User.deleteOne({ id: userId });

    return res.status(201).json({ success: true, message: 'User deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

export default userRouter;
