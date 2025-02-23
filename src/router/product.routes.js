import { Router } from "express";
import { verifyAuthToken } from "../middlewares/auth.middleware.js";
import { checkUserisActive } from "../middlewares/active.middleware.js";
import ProductController from "../controller/product.controller.js";
const productRouter = Router()

productRouter.post('/product',verifyAuthToken,checkUserisActive,ProductController.createProduct)
productRouter.get('/product',verifyAuthToken,checkUserisActive,ProductController.getAllProduct)
productRouter.patch('/product/update/:corelationId',verifyAuthToken,checkUserisActive,ProductController.updateProduct)
productRouter.patch('/product/delete/:corelationId',verifyAuthToken,checkUserisActive,ProductController.deleteProduct)

export default productRouter