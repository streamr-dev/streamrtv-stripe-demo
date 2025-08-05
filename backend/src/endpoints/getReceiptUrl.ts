import { Router, Request, Response, NextFunction } from 'express';
import StripeWrapper from './StripeWrapper';

export default function getReceiptUrl(stripeWrapper: StripeWrapper): Router {
    const router = Router();

    router.get('/', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const paymentIntentId = req.query.paymentIntentId as string;
            if (!paymentIntentId) {
                res.status(400).json({ error: 'paymentIntentId is required' });
                return;
            }
            const url = await stripeWrapper.getReceiptUrlForPaymentIntentId(paymentIntentId);
            res.json({ url });
        } catch (error) {
            console.error('Error fetching receipt:', error);
            next(error);
        }
    });

    return router;
}