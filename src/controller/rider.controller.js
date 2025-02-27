import { createRiderSchema } from "../validation/rider.validation.js"
import RiderService from "../services/rider.service.js"
import { sendApiResponse } from "../utils/expressResponse/expressResponse.js"
import statusCode from 'http-status-codes'

class RiderController {

    async createRider(req,res,next){
        try{    
            const content = await createRiderSchema.parseAsync(req.body)
            const userId = req.user.userId
            const apiResponse = await RiderService.createRiderService(userId,content)
            const contentMessage = `The Rider has been Created`
            sendApiResponse(res,apiResponse,contentMessage,statusCode.ACCEPTED)
        }catch(err){
            next(err)
        }
    }

    async getAllOrder(req,res,next) {
        try{
            const apiResposne = await RiderService.getAllOrders()
            const contentMessage = `All Order Fetches`
            sendApiResponse(res,apiResposne,contentMessage,statusCode.ACCEPTED);
        }catch(err){
            next(err)
        }
    }

    async applyOrders(req,res,next){
        try{
            const orderId = req.params.orderId
            const userId = req.user.userId
            const apiResponse = await RiderService.applyOrders(orderId,userId)
            const contentMessage = `The Order is ongoing,Rider is delivering it`
            sendApiResponse(res,apiResponse,contentMessage,statusCode.ACCEPTED); 
        }catch(err){
            next(err)
        }
    }

    async completeRide(req,res,next){
        try{
            const orderId = req.params.orderId
            const userId = req.user.userId
            const apiResponse = await RiderService.completeOrderRideService(orderId,userId)
            const contentMessage = `The Order have been Completed`
            sendApiResponse(res,apiResponse,contentMessage,statusCode.ACCEPTED);
        }catch(err){
            next(err)
        }
    }
}


export default new RiderController()