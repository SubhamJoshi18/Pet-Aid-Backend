import { Router } from "express";
import { verifyAuthToken } from "../middlewares/auth.middleware";
import { checkUserisActive } from "../middlewares/active.middleware";
import ProductController from "../controller/product.controller";
const productRouter = Router()

productRouter.post('/product',verifyAuthToken,checkUserisActive,ProductController.createProduct)

export default productRouter