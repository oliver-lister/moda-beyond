import 'dotenv/config';
import express, { Request, Response } from 'express';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

router.post('/checkout', async (req: Request, res: Response) => {
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

    return res.status(200).json({ success: true, message: 'Payment successful', url: session.url });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});
