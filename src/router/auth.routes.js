import { Router } from "express";
import AuthController from "../controller/auth.controller.js";
import { verifyAuthToken } from "../middlewares/auth.middleware.js";
import { checkUserisActive } from "../middlewares/active.middleware.js";

const authRouter = Router()

authRouter.post('/auth/signup',AuthController.signUp)
authRouter.post('/auth/login',AuthController.signIn)
authRouter.post('/auth/forget-password',AuthController.forgetPassword)
authRouter.get('/auth/check-link/:u',AuthController.checkResetLink)
authRouter.post('/auth/reset-password/:tokenId/:userId',AuthController.resetPassword)
authRouter.post('/auth/logout',verifyAuthToken,checkUserisActive,AuthController.logout)


export default authRouter