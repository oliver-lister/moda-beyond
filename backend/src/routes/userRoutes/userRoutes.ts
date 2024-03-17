import { JwtPayload } from 'jsonwebtoken';
import 'dotenv/config';
import cartRoutes from './cartRoutes/cartRoutes';
import authRoutes from '../authRoutes/authRoutes';
import { authorizeJWT } from '../../middleware/authMiddleware';
import express, { Request, Response } from 'express';
import { User } from '../../models/models';
import 'dotenv/config';

const router = express.Router();

router.use('/:userId/cart', cartRoutes);

export interface AuthorizedRequest extends Request {
  user?: string | JwtPayload;
}

// API for fetching user data
router.get('/:userId/fetchdata', authorizeJWT, async (req: AuthorizedRequest, res: Response) => {
  try {
    const userId = req.params.userId;

    if (userId !== req.user) {
      return res.status(403).json({ success: false, error: 'You do not have permission to access this resource.', errorCode: 'FORBIDDEN_ACCESS' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not be found in database', errorCode: 'USER_NOT_FOUND' });
    }

    return res.status(200).json({ success: true, message: 'User data successfully fetched', user });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

export default router;
