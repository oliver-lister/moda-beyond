import 'dotenv/config';
import express, { Request, Response } from 'express';
import { Product } from '../../models/models';

const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Stripe prices as price in cents

export interface CartItemProps {
  _id?: string;
  cartItemId: string;
  productId: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
}

router.post('/create-checkout-session', async (req: Request, res: Response) => {
  try {
    if (!req.body.items) throw new Error('No items supplied as arguments');

    const line_items = await Promise.all(
      req.body.items.map(async (item: CartItemProps) => {
        const product = await Product.findById(item.productId);
        if (!product)
          return res
            .status(404)
            .json({ success: false, error: `Product Id: ${item.productId} in cart does not exist in database`, errorCode: 'NO_SUCH_PRODUCT' });

        return {
          price_data: {
            currency: 'aud',
            product_data: {
              name: `${item.size} ${item.color} ${product.name}`,
              images: product.images.map((img) => `${process.env.BACKEND_HOST}${img}`),
            },
            unit_amount: product.price * 100,
          },
          quantity: item.quantity,
        };
      }),
    );

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: line_items,
      payment_method_types: ['card'],
      mode: 'payment',
      return_url: `${req.headers.origin}/moda-beyond/#/cart/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    return res
      .status(200)
      .json({ success: true, message: 'Checkout session creation successful', id: session.id, client_secret: session.client_secret });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

router.get('/get-session/:sessionId', async (req: Request, res: Response) => {
  try {
    const sessionId = req.params.sessionId;
    if (!sessionId) return res.status(404).json({ success: false, error: 'Session ID not supplied', errorCode: 'NO_SESSION_ID' });

    const session = await stripe.checkout.sessions.retrieve(sessionId!);

    return res.status(200).json({ success: true, message: 'Checkout session fetched successfully', session: session });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

export default router;
