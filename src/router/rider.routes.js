import { Router } from "express";
import { verifyAuthToken } from "../middlewares/auth.middleware.js";
import { checkUserisActive } from "../middlewares/active.middleware.js";
import RiderController from "../controller/rider.controller.js";
import { isRider } from "../middlewares/role.middleware.js";

const riderRouter = Router()

riderRouter.post('/rider/create',verifyAuthToken,checkUserisActive,RiderController.createRider);
riderRouter.get('/rider/orders',verifyAuthToken,checkUserisActive,isRider,RiderController.getAllOrder);
riderRouter.post('/rider/apply/:orderId',verifyAuthToken,checkUserisActive,isRider,RiderController.applyOrders)
riderRouter.patch('/rider/complete/:orderId',verifyAuthToken,checkUserisActive,isRider,RiderController.completeRide)

export default riderRouter