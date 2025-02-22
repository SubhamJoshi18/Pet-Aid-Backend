import { globalErrorHandler } from "../middlewares/error.middleware.js"
import { handleNotFoundRoute } from "../utils/expressResponse/expressResponse.js"
import authRouter from "./auth.routes.js"
import healthRouter from "./health.route.js"
import userRouter from "./user.routes.js"

const serverRouter = (expressApp) => {

    expressApp.use('/api',[healthRouter,authRouter,userRouter])

    expressApp.use('*',handleNotFoundRoute)
    expressApp.use(globalErrorHandler)
}


export {
    serverRouter
}
