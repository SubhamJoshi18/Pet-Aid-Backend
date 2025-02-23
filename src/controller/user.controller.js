import UserService from "../services/user.service.js"
import { sendApiResponse } from "../utils/expressResponse/expressResponse.js"
import statusCode from 'http-status-codes'
import { updateUserProfileSchema } from "../validation/user.validation.js"

class UserController {

    async getUserProfile(req,res,next){
        try{
            const userId = req.user.userId
            const apiResponse = await UserService.getUserProfile(userId)
            const content = `User Profile Fetches`
            sendApiResponse(res,apiResponse,content,statusCode.ACCEPTED)
        }catch(err){
            next(err)
        }
    }

    async deactivateUser(req,res,next) {
        try{
            const userid = req.user.userId
            const apiResponse = await UserService.deactivateUserProfile(userid)
            const content = 'User Has been Permantly Deactivated'
            sendApiResponse(res,apiResponse,content,statusCode.ACCEPTED)
        }catch(err){
            next(err)
        }
    }


    async activateUser(req,res,next) {
        try{
            const userId = req.user.userId
            const apiResponse = await UserService.activateUserProfile(userId)
            const content = `User Has Been Activated Successfully`
            sendApiResponse(res,apiResponse,content,statusCode.ACCEPTED)
        }catch(err){
            next(err)
        }
    }

    async updateUserProfile(req,res,next) {
        try{
            const userId = req.user.userId
            const content = await updateUserProfileSchema.parseAsync(req.body)
            const apiResponses = await UserService.updateUserProfile(userId,content)
            const messageContent = `The User has been Updated`
            sendApiResponse(res,apiResponses,messageContent,statusCode.ACCEPTED)
        }catch(err){
            next(err)
        }
    }

}

export default new UserController()