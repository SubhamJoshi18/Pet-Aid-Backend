import { Router } from "express";
import { verifyAuthToken } from "../middlewares/auth.middleware.js";
import { checkUserisActive } from "../middlewares/active.middleware.js";
import PurchaseController from "../controller/purchase.controller.js";

const purchaseRouter = Router()

purchaseRouter.post('/purchase/:productId',verifyAuthToken,checkUserisActive,PurchaseController.purchaseProduct)
purchaseRouter.get('/purchase',verifyAuthToken,checkUserisActive,PurchaseController.getAllPurchasedProduct)



export default purchaseRouter