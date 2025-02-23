import { Router } from "express";
import UserController from "../controller/user.controller.js";
import { verifyAuthToken } from "../middlewares/auth.middleware.js";
import { checkUserisActive } from "../middlewares/active.middleware.js";


const userRouter = Router()

userRouter.get('/user/profile',verifyAuthToken, UserController.getUserProfile)
userRouter.patch('/user/activate',verifyAuthToken,UserController.activateUser)
userRouter.patch('/user/deactivate',verifyAuthToken,checkUserisActive,UserController.deactivateUser)
userRouter.put('/user',verifyAuthToken,checkUserisActive,UserController.updateUserProfile)
userRouter.get('/product/wishlist',verifyAuthToken,checkUserisActive,UserController.getUserProductWishlist)

export default userRouter