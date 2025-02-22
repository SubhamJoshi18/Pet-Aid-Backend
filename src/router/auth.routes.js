import { Router } from "express";

const authRouter = Router()

authRouter.post('/signup',(req,res) => {console.log(`Hello World`)})


export default authRouter