import { handleNotFoundRoute } from "../utils/expressResponse/expressResponse.js"
import authRouter from "./auth.routes.js"


const serverRouter = (expressApp) => {

    expressApp.use('/api',[authRouter])

    expressApp.use('*',handleNotFoundRoute)




}


export {
    serverRouter
}
