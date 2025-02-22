import { Router } from "express";
import UserController from "../controller/user.controller.js";
import { verifyAuthToken } from "../middlewares/auth.middleware.js";

const userRouter = Router()

userRouter.get('/user/profile',verifyAuthToken, UserController.getUserProfile)

export default userRouter