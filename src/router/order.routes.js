import { Router } from "express";
import { verifyAuthToken } from "../middlewares/auth.middleware.js";
import { checkUserisActive } from "../middlewares/active.middleware.js";
import OrderController from "../controller/order.controller.js";

const orderRouter = Router()

orderRouter.post('/order/:productId/:corelationId',verifyAuthToken,checkUserisActive,OrderController.orderProduct)
orderRouter.get('/order',verifyAuthToken,checkUserisActive,OrderController.getAllUserProduct)
orderRouter.patch('/order/cancel/:orderId',verifyAuthToken,checkUserisActive,OrderController.cancelOrder)


export default orderRouter
