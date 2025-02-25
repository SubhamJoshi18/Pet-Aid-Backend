import OrderService from "../services/order.service.js"
import { sendApiResponse } from "../utils/expressResponse/expressResponse.js"
import { createOrderSchema } from "../validation/order.validation.js"
import statusCode from 'http-status-codes'

class OrderController {

    async orderProduct(req,res,next){   
        try{
            const paymentCorelationId = req.params.corelationId
            const productId = req.params.productId
            const parseContent = await createOrderSchema.parseAsync(req.body)
            const apiResponse = await  OrderService.orderProductService(parseContent,productId,paymentCorelationId)
            const contentMessage = `The Order have been Placed`
            sendApiResponse(res,apiResponse,contentMessage,statusCode.ACCEPTED)
        }catch(err){
            next(err)
        }
    }

    async getAllUserProduct(req,res,next) {
        try{
            const userId = req.user.userId
            const apiResposne = await OrderService.getAllUserProduct(userId)
            const contentMessage = `All the User Orders`;
            sendApiResponse(res,apiResposne,contentMessage,statusCode.ACCEPTED);
        }catch(err){
            next(err)
        }
    }


}


export default new OrderController()