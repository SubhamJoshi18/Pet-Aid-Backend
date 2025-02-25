import PurchaseService from "../services/purchase.service.js"
import { sendApiResponse } from "../utils/expressResponse/expressResponse.js"
import { purchaseProductSchema } from "../validation/purchase.validation.js"
import statusCode from 'http-status-codes'

class PurchaseController {

    async purchaseProduct(req,res,next) {
            try{
                const productId = req.params.productId
                const content = req.body
                const parseContent = await purchaseProductSchema.parseAsync(content)
                const userId = req.user.userId
                const apiResponse = await PurchaseService.purchaseProductService(productId,userId,parseContent)
                const messageContent = `The Product have been Purchased`
                sendApiResponse(res,apiResponse,messageContent,statusCode.ACCEPTED)
            }catch(err){
                next(err)
            }
    }

    async getAllPurchasedProduct(req,res,next) {
        try{
            const userId = req.user.userId
            const apiResposne = await PurchaseService.getAllPurchaseProductService(userId)
            const contentMessage = `All User Purchased Product`
            sendApiResponse(res,apiResposne,contentMessage,statusCode.ACCEPTED)
        }catch(err){
            next(err)
        }
    }


    async getAllTransaction(req,res,next){
        try{
            const userId = req.user.userId
            const apiResponse = await PurchaseService.getAllTransactionService(userId)
            const contentMessage = `All the Transaction for the User`
            sendApiResponse(res,apiResponse,contentMessage,statusCode.ACCEPTED);
        }catch(err){
            next(err)
        }
    }
}


export default new PurchaseController()