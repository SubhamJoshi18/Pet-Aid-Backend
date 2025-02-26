import { Router } from "express";
import { verifyAuthToken } from "../middlewares/auth.middleware.js";
import { checkUserisActive } from "../middlewares/active.middleware.js";
import RiderController from "../controller/rider.controller.js";

const riderRouter = Router()

riderRouter.post('/rider/create',verifyAuthToken,checkUserisActive,RiderController.createRider);
riderRouter.get('/rider/orders',verifyAuthToken,checkUserisActive,RiderController.getAllOrder);
riderRouter.post('/rider/apply',verifyAuthToken,checkUserisActive,)

export default riderRouter