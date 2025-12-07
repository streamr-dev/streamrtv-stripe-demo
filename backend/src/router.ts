import { Router } from 'express';
import createPaymentIntentRouter from './endpoints/createPaymentIntent';
import getPaymentIntentsRouter from './endpoints/getPaymentIntents';
import accountsRouter from './endpoints/accounts';
import dashboardRouter from './endpoints/dashboard';
import lookupAccountRouter from './endpoints/lookupAccount';
import onboardRouter from './endpoints/onboard';
import getReceiptUrlRouter from './endpoints/getReceiptUrl';
import StripeWrapper from "./endpoints/StripeWrapper";

const router = Router();

const stripeWrapper = new StripeWrapper()

router.use('/create-payment-intent', createPaymentIntentRouter(stripeWrapper));
router.use('/get-payment-intents', getPaymentIntentsRouter(stripeWrapper));
router.use('/accounts', accountsRouter(stripeWrapper));
router.use('/dashboard', dashboardRouter(stripeWrapper));
router.use('/lookup-account', lookupAccountRouter(stripeWrapper));
router.use('/onboard', onboardRouter(stripeWrapper));
router.use('/get-receipt-url', getReceiptUrlRouter(stripeWrapper));

export default router;