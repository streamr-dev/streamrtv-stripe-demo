import { Router } from 'express';
import createPaymentIntentRouter from './stripe/createPaymentIntent';
import getPaymentIntentsRouter from './stripe/getPaymentIntents';
import accountsRouter from './stripe/accounts';
import dashboardRouter from './stripe/dashboard';
import lookupAccountRouter from './stripe/lookupAccount';
import onboardRouter from './stripe/onboard';

const router = Router();

router.use('/create-payment-intent', createPaymentIntentRouter);
router.use('/get-payment-intents', getPaymentIntentsRouter);
router.use('/accounts', accountsRouter);
router.use('/dashboard', dashboardRouter);
router.use('/lookup-account', lookupAccountRouter);
router.use('/onboard', onboardRouter);

export default router;