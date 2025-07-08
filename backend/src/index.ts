import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import stripeRouter from './stripe';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/stripe', stripeRouter);

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});