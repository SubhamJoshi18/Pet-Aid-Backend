import { productCreateSchema } from "../validation/product.validation"
import ProductService from "../services/product.service"
import { sendApiResponse } from "../utils/expressResponse/expressResponse"
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



}


export default new ProductController()