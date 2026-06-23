import { Router } from 'express';

import { getAllProducts } from '../controllers/products.controller.js';

const productRouter = Router();

productRouter.get('/', getAllProducts);

export default productRouter;
