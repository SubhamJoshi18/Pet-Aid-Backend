import UserService from "../services/user.service.js"
import { sendApiResponse } from "../utils/expressResponse/expressResponse.js"
import statusCode from 'http-status-codes'

class UserController {

    async getUserProfile(req,res,next){
        try{
            console.log(req.user)
            const userId = req.user.userId
            const apiResponse = await UserService.getUserProfile(userId)
            const content = `User Profile Fetches`
            sendApiResponse(res,apiResponse,content,statusCode.ACCEPTED)
        }catch(err){
            next(err)
        }
    }

}

export default new UserController()