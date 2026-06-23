import { Router } from 'express';

import productRouter from './products.route.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

router.use('/products', productRouter);

export default router;
