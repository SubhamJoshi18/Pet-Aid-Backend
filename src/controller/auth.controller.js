import AuthServices from "../services/auth.service.js"
import { sendApiResponse } from "../utils/expressResponse/expressResponse.js"
import { forgetPasswordSchema, resetPasswordSchema, signInSchema, signUpSchema } from "../validation/auth.validation.js"
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

    async forgetPassword(req,res,next) {
        try{
            const content = req.body
            const parsebody = await forgetPasswordSchema.parseAsync(content)
            const apiResponse = await AuthServices.forgetPassword(parsebody)
            const contentMessage = `The Mail has been Sended Successfully`
            sendApiResponse(res,apiResponse,contentMessage,statusCode.ACCEPTED)
        }catch(err){
            next(err)
        }
    }

    async checkResetLink(req,res,next) {
            try{
                const tokenId = req.params.tokenId
                const apiResposne = await AuthServices.checkResetToken(tokenId)
                const contentMessage = `The Provided Token is Valid`
                sendApiResponse(res,apiResposne,contentMessage,statusCode.ACCEPTED)
            }catch(err){
                next(err)
        }
    }

    async resetPassword(req,res,next){
        try{
            const tokenId = req.params.tokenId
            const userId = req.params.userId
            const content = await resetPasswordSchema.parseAsync(req.body)
            const apiResposne = await AuthServices.resetPassword(tokenId,userId,content)
            const contentMessage = `The Provided Token is Valid`
            sendApiResponse(res,apiResposne,contentMessage,statusCode.ACCEPTED)
        }catch(err){
            next(err)
        }
    }
    
    async logout(req,res,next){
        try{
            const token = req.headers['Authorization'] ?? req.headers.authorization
            const apiResponse = await AuthServices.logoutServices(token)
            const contentMessage = `Log out Successfully`
            sendApiResponse(res,apiResponse,contentMessage,statusCode.ACCEPTED)
        }catch(err){
            next(err)
        }
    }
 }

export default new AuthController()