import { createProductReviewScehma } from "../validation/product.validation.js"
import ProductReviewService from "../services/product.review.service.js"
import { sendApiResponse } from "../utils/expressResponse/expressResponse.js"
import statuscode from 'http-status-codes'

class ProductReviewController {

    async addReview(req,res,next){
        try{
            const userId = req.user.userId
            const productId = req.params.productId
            const content = await createProductReviewScehma.parseAsync(req.body)
            const apiResponse = await ProductReviewService.addReviewService(userId,productId,content)
            const contentMessage = `Review has been added`
            sendApiResponse(res,apiResponse,contentMessage,statuscode.ACCEPTED)
        }catch(err){
            next(err)
        }
    }

    async deleteReview(req,res,next){
        try{
            const userId = req.user.userId
            const productId = req.params.productId
            const reviewId = req.params.reviewId
            const apiResponse = await ProductReviewService.deleteReview(userId,productId,reviewId)
            const contentMessage = `Review has been Deleted`
            sendApiResponse(res,apiResponse,contentMessage,statuscode.ACCEPTED)
        }catch(err){
            next(err)
        }
    }

    async getProductReviews(req,res,next){
        try{
            const productId = req.params.productId
            const apiResponse = await ProductReviewService.getProductReviews(productId)
            const contentMessage = `Product Reviews has been Fetches`
            sendApiResponse(res,apiResponse,contentMessage,statuscode.ACCEPTED)
        }catch(err){
            next(err)
        }
    }

}   

export default new ProductReviewController()