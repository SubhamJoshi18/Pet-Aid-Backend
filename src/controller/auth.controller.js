import AuthServices from "../services/auth.service.js"
import { sendApiResponse } from "../utils/expressResponse/expressResponse.js"
import { signInSchema, signUpSchema } from "../validation/auth.validation.js"
import statusCode from 'http-status-codes'

class AuthController {

    async signUp (req,res,next){
            try{
                const content = req.body
                const parseBody  = await signUpSchema.parseAsync(content)
                const apiResponse = await AuthServices.signUpService(parseBody)
                const contentMessage = `User ${parseBody.fullName} SignUp SuccessFully`
                sendApiResponse(res,apiResponse,contentMessage,statusCode.ACCEPTED)
            }catch(err){
                next(err)
            }
    }
    async signIn(req,res,next) {
        try{
            const content = req.body
            const parseBody = await signInSchema.parseAsync(content)
            const apiResponse = await AuthServices.signInService(parseBody)
            const contentMessage = `User Has been Signed In Successfully`
            sendApiResponse(res,apiResponse,contentMessage,statusCode.ACCEPTED)
        }catch(err){
            console.log(err)
            next(err)
        }
    }
}

export default new AuthController()