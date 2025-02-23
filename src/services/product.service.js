
import Product from "../database/schemas/products/product.schema.js"
import statusCode from 'http-status-codes'
import {v4 as uuidv4} from 'uuid'
import { productCategory } from "../constants/category.js"
import { DatabaseExceptions, ValidationExceptions } from "../exceptions/index.js"

class ProductService {


    async createProductService(payload){
        const {name , description, category, price, tags } = payload
        
        const sameNameProduct = await Product.findOne({
            name : name
        })

        if(sameNameProduct) {
            throw new DatabaseExceptions(`The Product Name is already Exists, Please try a new name`,statusCode.BAD_GATEWAY)
        }

        const productCategoryValid = Object.keys(productCategory).includes(category) || category in productCategory

        if(!productCategoryValid) {
            throw new DatabaseExceptions(`The Category you have been provided is not categorized in our system`,statusCode.BAD_REQUEST)
        }


        const parsePrice =  price.toString().includes('.') ?  Math.ceil(price) : price
        const positivePrice = price > 0
        if(typeof positivePrice === 'boolean' && !positivePrice) {
            throw new DatabaseExceptions(`The Price should be higher than the 0`)
        }

        const corelationId = uuidv4()

        const alreadyExistsCorelationId = await Product.findOne({corelationId : corelationId})
        if(alreadyExistsCorelationId) throw new DatabaseExceptions(`The Co Relation Id is already assign to the product`,statusCode.BAD_REQUEST);


        const insertResult = await Product.create({
            name : name,
            price : parsePrice,
            corelationId : corelationId,
            description : description,
            tags : tags,
            category : category
        })

        const validInsert = insertResult._id

        return validInsert ?
        {
                message : `The Product Has been Created`,
                data : insertResult
        } :

        {
            message : `There is an issue while creating Product`,
            data : null
        }
    }

    async getAllProduct() {
        const allProducts = await Product.find({})
        
        if(allProducts && allProducts.length.toString().startsWith('0')) {
            throw new DatabaseExceptions(`Product are not available Right Now`,statusCode.BAD_REQUEST)
        }
        const filterdProduct = allProducts.filter((data) => !data.isDeleted)
        return filterdProduct
    }


    async updateProduct(corealtionId,content) {

        const validProductPayload = Object.keys(content).length > 0
        if(!validProductPayload) {
            throw new ValidationExceptions(`There is nothing to be Updated`,statusCode.BAD_REQUEST)
        }


        const productDoc = await Product.findOne({
            corelationId : corealtionId
        })

        if(!productDoc) {
            throw new DatabaseExceptions(`The Product Does not Exists,Please try a valid Co-Relation Id`)
        }

        const isDeletedStatus = productDoc.isDeleted

        if(typeof isDeletedStatus === 'boolean' && isDeletedStatus) {
            throw new DatabaseExceptions(`The Product have been already Deleted`,statusCode.BAD_REQUEST)
        }

        const updatedProduct = await Product.updateOne(
            {
                corelationId : corealtionId
            },

            {
                ...content,
                isUpdated : true
            },
            {
                $new : true
            }
        )

        const validUpdateResult = updatedProduct.acknowledged && updatedProduct.matchedCount > 0;
        return validUpdateResult ?
        {
            message : `The Product has been Updated for Co-relationId${corealtionId}`,
            updateResult : updatedProduct
        }:
        {   
            message : `There is some issue while updating the Products`,
            updateResult : null
        }
    }   

    async deleteProductService(coRelationId){
        const productDoc = await Product.findOne({
            corelationId : coRelationId
        })
        const isDeletedStatus = productDoc.isDeleted
        if(isDeletedStatus) throw new DatabaseExceptions(`The Product have been already Deleted`,statusCode.BAD_REQUEST);
        const deletedResult = await Product.updateOne({corelationId : coRelationId},{isDeleted : true},{$new : true})
        return deletedResult.acknowledged && deletedResult.matchedCount > 0 ? {message : `The Product have been deleted`} : {message : null}
    }

}

export default new ProductService()