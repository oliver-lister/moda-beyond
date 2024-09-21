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
    console.log(userId);

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
  item.productId === newItem.productId && item.size === newItem.size && item.color === newItem.color;

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
      updatedCart[existingItemIndex].quantity += newItem.quantity || 1;
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
    if (!req.user || typeof req.user === 'string' || req.user.userId !== req.params.userId) {
      return res.status(403).json({ success: false, error: 'You do not have permission to access this resource.', errorCode: 'FORBIDDEN_ACCESS' });
    }

    const userId = req.params.userId;
    const cartItemId = req.params.cartItemId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found in database', errorCode: 'USER_NOT_FOUND' });
    }

    // Find the index of the cart item to update
    const cartItemIndex = user.cart.findIndex((item) => String(item._id) === cartItemId);

    if (cartItemIndex === -1) {
      return res.status(404).json({ success: false, error: 'Cart item not found', errorCode: 'CART_ITEM_NOT_FOUND' });
    }

    // Create a new cart array to avoid direct mutation
    const updatedCart = [...user.cart];

    // Update the properties of the cart item
    const updatedCartItem = { ...updatedCart[cartItemIndex], ...req.body };
    updatedCart[cartItemIndex] = updatedCartItem;

    const consolidatedCart: CartItem[] = [];

    // Iterate over each cart item
    updatedCart.forEach((item: CartItem) => {
      // Check if item already exists in consolidatedCart
      const existingItemIndex = consolidatedCart.findIndex((i: CartItem) => isMatching(i, item));

      if (existingItemIndex !== -1) {
        // If found, update the quantity
        consolidatedCart[existingItemIndex].quantity += item.quantity;
      } else {
        // If not found, add the new item to consolidatedCart
        consolidatedCart.push({ ...item });
      }
    });

    // Assign the new cart
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
    if (!req.user || typeof req.user === 'string' || req.user.userId !== req.params.userId) {
      return res.status(403).json({ success: false, error: 'You do not have permission to access this resource.', errorCode: 'FORBIDDEN_ACCESS' });
    }

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
    if (!req.user || typeof req.user === 'string') {
      return res.status(403).json({ success: false, error: 'You do not have permission to access this resource.', errorCode: 'FORBIDDEN_ACCESS' });
    }

    const userId = req.user.userId;
    const cartItemId = req.params.cartItemId;

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
