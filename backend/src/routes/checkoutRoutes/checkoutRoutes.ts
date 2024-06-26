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
    if (!req.body.items) return res.status(404).json({ success: false, error: `No items supplied in request body`, errorCode: 'NO_ITEMS' });

    const delivery = req.body.delivery;

    const deliveryLineItem = {
      price_data: {
        currency: 'aud',
        product_data: {
          name: delivery.label,
          description: `Estimated delivery: ${delivery.est}`,
        },
        unit_amount: delivery.fee * 100,
      },
      quantity: 1,
    };

    const line_items = [
      ...(await Promise.all(
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
              },
              unit_amount: Math.ceil(product.price * 100),
            },
            quantity: item.quantity,
          };
        }),
      )),
      deliveryLineItem,
    ];

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: line_items,
      payment_method_types: ['card'],
      mode: 'payment',
      return_url: `${req.headers.origin}/moda-beyond/#/cart/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
      shipping_address_collection: {
        allowed_countries: ['AU'],
      },
      customer_email: req.body.customer_email,
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

    const session = await stripe.checkout.sessions.retrieve(sessionId!, { expand: ['line_items'] });

    return res.status(200).json({
      success: true,
      message: 'Checkout session fetched successfully',
      session: session,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

router.get('/get-charge/:paymentIntentId', async (req: Request, res: Response) => {
  try {
    const paymentIntentId = req.params.paymentIntentId;
    if (!paymentIntentId) return res.status(404).json({ success: false, error: 'chargeId not supplied', errorCode: 'NO_CHARGE_ID' });

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId!, { expand: ['latest_charge'] });

    if (!paymentIntent) {
      return res.status(404).json({ success: false, error: 'Payment intent not found', errorCode: 'PAYMENT_INTENT_NOT_FOUND' });
    }

    return res.status(200).json({
      success: true,
      message: 'Receipt url fetched successfull from latest charge on payment intent',
      receiptUrl: paymentIntent.latest_charge.receipt_url,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Internal Server Error: ${err.message}`, errorCode: 'INTERNAL_SERVER_ERROR' });
  }
});

export default router;
