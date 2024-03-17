import express, { Response } from 'express';
import { User, Product } from '../../../models/models';
import { authorizeJWT } from '../../../middleware/authMiddleware';
import { AuthorizedRequest } from '../userRoutes';

const router = express.Router();

// API for adding a product to the user's cart
router.post('/add', authorizeJWT, async (req: AuthorizedRequest, res: Response) => {
  try {
    const { productId, color, price, quantity, size } = req.body;

    const { userId } = req.user as { userId: string };
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found', errorCode: 'USER_NOT_FOUND' });
    }

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found', errorCode: 'PRODUCT_NOT_FOUND' });
    }

    user.cart.push({ productId, color, price, quantity, size });

    await user.save();

    return res.status(201).json({ success: true, message: 'Product added to the cart successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

// API for updating a user's cart
router.put('/update', authorizeJWT, async (req: AuthorizedRequest, res: Response) => {
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
