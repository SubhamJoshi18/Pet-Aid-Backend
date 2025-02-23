
import Product from "../database/schemas/products/product.schema.js"
import statusCode from 'http-status-codes'
import {v4 as uuidv4} from 'uuid'
import { productCategory } from "../constants/category.js"
import { DatabaseExceptions, ValidationExceptions } from "../exceptions/index.js"
import User from "../database/schemas/user.schema.js"
import UserProfile from "../database/schemas/userProfile.schema.js"
import ProductWishlist from "../database/schemas/products/wishlist.schema.js"
import { petAidLogger } from "../libs/logger.js"

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

    async addProductToWishlist(productId,corelationId,userId){
        const productDoc = await Product.findOne({
            $and : [
                {
                    _id : productId
                },
                {
                    corelationId : corelationId
                }
            ]
        })

        if(!productDoc) throw new DatabaseExceptions(`The Product Does not Exists`,statusCode.BAD_REQUEST);
        
        const userDoc = await User.findOne({
            _id : userId
        }).populate('userProfile')

        const userProId = userDoc.userProfile._id
        const userProfileDoc = await UserProfile.findOne({_id : userProId})

    
        const userName = userDoc.fullName

        const payloadForWishlist = {
            addedBy : userName,
            product : productDoc._id
        }

        const insertResult = await ProductWishlist.create({
            addedBy : payloadForWishlist['addedBy'],
            product : payloadForWishlist['product']
        })

        const wishListId = insertResult._id
        const checkCount = userProfileDoc.wishListCount

        const updatedUserWishList = await User.updateOne(
            { _id: userId },
            { $push: { productWishList: wishListId } }
        );

        if(checkCount.toString().startsWith('0')) {
            petAidLogger.info(`User is adding the Product in the WishList  For the First Time`)
            userProfileDoc.wishListCount += 1
            await userProfileDoc.save()
        }else{
            userProfileDoc.wishListCount += 1
            await userProfileDoc.save()
        }
        return {
            data : insertResult,
            updateResult : updatedUserWishList,
            message : `${userName} Has Added Product to the Wishlist`
        }
    }

    async removeProductFromWishlist(productId,corelationId,userId,wishListId){
       
       
        const productDoc = await Product.findOne({
            $and : [
                {
                    _id : productId
                },
                {
                    corelationId : corelationId
                }
            ]
        })

        if(!productDoc) throw new DatabaseExceptions(`The Product Does not Exists`,statusCode.BAD_REQUEST);
        
        const userDoc = await User.findOne({
            _id : userId
        }).populate('userProfile')

        const userProId = userDoc.userProfile._id
        const userProfileDoc = await UserProfile.findOne({_id : userProId})


        if(!isProfileExists) throw new DatabaseExceptions(`Profile Does not Exists for the User : ${userDoc._id}`);

        const deletedResult = await ProductWishlist.deleteOne({_id : wishListId})

        const updatedPromise = await Promise.allSettled([
            UserProfile.updateOne({_id : userProfileDoc._id},{wishListCount : Math.ceil(userProfileDoc.wishListCount - 1 )}),
            User.updateOne({_id : userId},{$pull : {productWishList : wishListId }})
        ])

        const filteredRejection = updatedPromise.filter((data) => data.status !== 'fulfilled')
        if(Array.isArray(filteredRejection) && filteredRejection.length > 0) throw new DatabaseExceptions(`There is some issuing while updating the information`,statusCode.BAD_GATEWAY);
        return {
            deletedResult ,
            message : `The Product has been removed from the WishList`
        }
    }

    async searchProductService(productQuery){   
        const productQueryArr = new Array(productQuery)
        const products = await Product.find({
            $and : productQueryArr
        })
        if(products && products.length.toString().startsWith('0')) {
            throw new DatabaseExceptions(`Product are not available right now, Please Try again Later`,statusCode.BAD_REQUEST);
        }
        const filteredProduct = products.filter((data) => !data.isDeleted)
        return filteredProduct
    }


}

export default new ProductService()