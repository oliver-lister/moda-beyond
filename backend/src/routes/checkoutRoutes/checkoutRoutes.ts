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
    const items = req.body.items.map(async (item: CartItemProps) => {
      const product = await Product.findById(item.productId);
      if (!product) throw new Error(`Product Id: ${item.productId} in cart does not exist in database`);
      return { price_data: { currency: 'aud', product_data: { name: product.name }, unit_amount: product.price * 100 }, quantity: item.quantity };
    });

    const session = await stripe.checkout.sessions.create({
      line_items: items,
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}cart/checkout/success`,
      cancel_url: `${process.env.CLIENT_URL}cart/checkout/cancel`,
    });

    return res.status(200).json({ success: true, message: 'Checkout session creation successful', url: session.url });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

export default router;
