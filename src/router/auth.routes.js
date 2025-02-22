import { Router } from "express";
import AuthController from "../controller/auth.controller.js";

const authRouter = Router()

authRouter.post('/auth/signup',AuthController.signUp)
authRouter.post('/auth/login',AuthController.signIn)


export default authRouter