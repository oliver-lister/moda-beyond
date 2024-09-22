import express, { Response } from 'express';
import { AuthorizedRequest } from '../userRoutes';
import { CartItem, User } from '../../../models/models';

const cartRouter = express.Router({ mergeParams: true });

// Get cart
cartRouter.get('/', async (req: AuthorizedRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === 'string' || req.user.userId !== req.params.userId) {
      return res.status(403).json({ success: false, error: 'You do not have permission to access this resource.', errorCode: 'FORBIDDEN_ACCESS' });
    }

    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not be found in database', errorCode: 'USER_NOT_FOUND' });
    }

    const cart = user.cart;

    return res.status(200).json({ success: true, message: 'Successfully fetched cart', cart });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

const isMatching = (item: CartItem, newItem: CartItem) =>
  String(item.productId) === String(newItem.productId) && item.size === newItem.size && item.color === newItem.color;

// Add item to cart
cartRouter.post('/', async (req: AuthorizedRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === 'string' || req.user.userId !== req.params.userId) {
      return res.status(403).json({ success: false, error: 'You do not have permission to access this resource.', errorCode: 'FORBIDDEN_ACCESS' });
    }

    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not be found in database', errorCode: 'USER_NOT_FOUND' });
    }

    const newItem = req.body;
    const existingItemIndex = user.cart.findIndex((item) => isMatching(item, newItem));

    // Create a new cart array to avoid direct mutation
    const updatedCart = [...user.cart];

    if (existingItemIndex !== -1) {
      // If the item exists, increment its quantity
      updatedCart[existingItemIndex].quantity += Number(newItem.quantity);
    } else {
      // If it doesn't exist, add the new item to the cart
      updatedCart.push(newItem);
    }

    user.cart = updatedCart; // Assign the new cart

    await user.save();

    return res.status(201).json({ success: true, message: 'Added item to cart' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

// Update item in cart
cartRouter.patch('/:cartItemId', async (req: AuthorizedRequest, res: Response) => {
  try {
    const userId = req.params.userId;
    const cartItemId = req.params.cartItemId;
    const updatedItem = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found in database', errorCode: 'USER_NOT_FOUND' });
    }

    const updatedCart = user.cart.map(({ _id, productId, size, color, quantity }: CartItem) => {
      if (String(_id) === cartItemId) return { _id, productId, size, color, quantity, ...updatedItem };
      return { _id, productId, size, color, quantity };
    });

    let consolidatedCart: CartItem[] = [];

    updatedCart.forEach((item: CartItem) => {
      // check if a matching item already exists in consolidatedCart
      const existingItemIndex = consolidatedCart.findIndex((i) => isMatching(i, item));

      // if it does, update its quantity
      if (existingItemIndex !== -1) {
        consolidatedCart[existingItemIndex].quantity += Number(item.quantity);
      } else {
        // otherwise, push item to consolidated cart
        consolidatedCart.push(item);
      }
    });

    user.cart = consolidatedCart;

    // Save the updated user
    await user.save();

    return res.status(204).json({ success: true, message: 'Cart item updated successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

// Delete item from cart
cartRouter.delete('/:cartItemId', async (req: AuthorizedRequest, res: Response) => {
  try {
    const userId = req.params.userId;
    const cartItemId = req.params.cartItemId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not be found in database', errorCode: 'USER_NOT_FOUND' });
    }

    // Filter out the cart item with the matching cartItemId
    user.cart = user.cart.filter((item) => String(item._id) !== cartItemId);

    await user.save();

    return res.status(200).json({ success: true, message: 'Added item to cart' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

// Clear cart
cartRouter.delete('/', async (req: AuthorizedRequest, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not be found in database', errorCode: 'USER_NOT_FOUND' });
    }

    user.cart = [];

    await user.save();

    return res.status(200).json({ success: true, message: 'Added item to cart' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

export default cartRouter;
