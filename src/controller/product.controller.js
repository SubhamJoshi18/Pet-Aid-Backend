import { productCreateSchema, updateProductSchema } from "../validation/product.validation.js"
import ProductService from "../services/product.service.js"
import { sendApiResponse } from "../utils/expressResponse/expressResponse.js"
import statusCode from 'http-status-codes'

class ProductController {

    async createProduct(req,res,next) {
        try{
            const content = await productCreateSchema.parseAsync(req.body)
            const apiResponse = await ProductService.createProductService(content)
            const messageContent = `The Product Have been Created`
            sendApiResponse(res,apiResponse,messageContent,statusCode.ACCEPTED)
        }catch(err){
            next(err)
        }
    }

    async getAllProduct(req,res,next) {
        try{
            const apiResponse = await ProductService.getAllProduct()
            const messageContent = `All Product have been Fetches`
            sendApiResponse(res,apiResponse,messageContent,statusCode.ACCEPTED)
        }catch(err){
            next(err)
        }
    }


    async updateProduct(req,res,next) {
        try{
            const coRelationProductId = req.params.corelationId
            const content = await updateProductSchema.parseAsync(req.body)
            const apiResponse = await ProductService.updateProduct(coRelationProductId,content)
            const messageContent = `The Product has been Updated`
            sendApiResponse(res,apiResponse,messageContent,statusCode.ACCEPTED)
        }catch(err){
            next(err)
        }
    }

    async deleteProduct(req,res,next) {
        try{
            const coRelationProductId = req.params.corelationId
            const apiResponse = await ProductService.deleteProductService(coRelationProductId)
            const messageContent = `The Product has been Updated`
            sendApiResponse(res,apiResponse,messageContent,statusCode.ACCEPTED)
        }catch(err){
            next(err)
        }
    }


    async addProductToWishlist(req,res,next){
        try{
            const productId = req.params.productId
            const corelationId = req.params.corelationId
            const userId = req.user.userId
            const apiResponse = await ProductService.addProductToWishlist(productId,corelationId,userId)
            const contentMessage = `The Product has been added to the WishList`
            sendApiResponse(res,apiResponse,contentMessage,statusCode.ACCEPTED)
        }catch(err){
            next(err)
        }
    }

    async removeProductFromWishlist(req,res,next){
        try{
            const productId = req.params.productId
            const corelationId = req.params.corelationId
            const wishListId = req.params.wishListId
            const userId = req.user.userId
            const apiResponse = await ProductService.addProductToWishlist(productId,corelationId,userId,wishListId)
            const contentMessage = `The Product has been added to the WishList`
            sendApiResponse(res,apiResponse,contentMessage,statusCode.ACCEPTED)
        }catch(err){
            next(err)
        }
    }

   

}


export default new ProductController()