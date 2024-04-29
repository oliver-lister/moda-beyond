import 'dotenv/config';
import express, { Request, Response } from 'express';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import { Product } from '../../models/models';

const router = express.Router();

// Stripe prices as price in cents

router.post('/create-checkout-session', async (req: Request, res: Response) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: '{{RECURRING_PRICE_ID}}',
          quantity: 1,
        },
        {
          price: '{{ONE_TIME_PRICE_ID}}',
          quantity: 1,
        },
      ],
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
