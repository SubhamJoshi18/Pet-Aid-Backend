import User from "../database/schemas/user.schema.js"
import statusCode from 'http-status-codes'
import { DatabaseExceptions } from "../exceptions/index.js"
import Product from "../database/schemas/products/product.schema.js";
import { reviewRates } from "../constants/review.js";
import ReviewProduct from "../database/schemas/products/reviewProduct.schema.js";


class ProductReviewService {

    async addReviewService (userId,productId,content) {

        const { reviewComment, reviewRating} = content
        
        const userDoc = await User.findOne({
            _id : userId
        }).populate('userProfile')
        
        if(!userDoc) throw new DatabaseExceptions(`The User Does not Exists on the System`,statusCode.BAD_GATEWAY);
        
        const productDoc = await Product.findOne({
            _id : productId
        }).populate('reviewProduct')

        if(!productDoc) throw new DatabaseExceptions(`The Product Does not Exists on the System`,statusCode.BAD_GATEWAY);


        const isValidRating = Math.ceil(reviewRating) <= 5 && Math.ceil(reviewRating) in reviewRates && reviewRates.includes(Math.ceil(reviewRating))

        if(!isValidRating) {
            throw new DatabaseExceptions(`The Rating should be between 1-5, Please enter the valid Rating`,statusCode.BAD_REQUEST);
        }


        const payloadReview = {
            reviewComment,
            reviewRating,
            productId : productDoc._id,
            user : userDoc._id
        }

        const updatedResutlReview = await ReviewProduct.create({
            reviewComment : reviewComment,
            reviewRating : Math.ceil(reviewRating),
            productId : payloadReview['productId'],
            user : payloadReview['user']
        })

        const reviewId = updatedResutlReview._id
        const updatedResult = await Product.updateOne(
            {
                _id : productId
            },
            {
                $push : {reviewProduct : reviewId}
            },
        )
        
        const validUpdated = updatedResult.acknowledged && updatedResult.matchedCount > 0
        return validUpdated ? 
        {
            data:updatedResult,
            message : `The ${userDoc.fullName} Has Add Review`,
        }:
        {
            data : null,
            message : `Error while adding the Review`
        }
    }

    async deleteReview(userId,productId,reviewId){

        const userDoc = await User.findOne({
            _id : userId
        }).populate('userProfile')
        
        if(!userDoc) throw new DatabaseExceptions(`The User Does not Exists on the System`,statusCode.BAD_GATEWAY);
        
        const productDoc = await Product.findOne({
            _id : productId
        }).populate('reviewProduct')

        if(!productDoc) throw new DatabaseExceptions(`The Product Does not Exists on the System`,statusCode.BAD_GATEWAY);


        const productDocId = productDoc._id

        const updatedPromise = await Promise.allSettled(
            [
                ReviewProduct.deleteOne({_id : reviewId}),
                Product.updateOne({_id : productDocId},{$pull : {reviewProduct : reviewId}})
            ]
        )

        const filteredRejection = updatedPromise.filter((data) => data.status !== 'fulfilled')

        if(Array.isArray(filteredRejection) && filteredRejection.length > 0){
            throw new DatabaseExceptions(`There is an issue while updating on removing the review`,statusCode.BAD_REQUEST);
        }

        const deletedResult = updatedPromise[0]['value']
        return deletedResult
    }

    async getProductReviews(productId){
        const productDocs = await Product.findOne({
            _id : productId
        }).populate({
            path : 'reviewProduct',
        })

        if(!productDocs){
            throw new  DatabaseExceptions(`Product Does not Exists with the Product Id : ${productId}`)
        }
        const productReviews = productDocs.reviewProduct
        const validReviews = Array.isArray(productReviews) && productReviews.length > 0
        return validReviews ? {productId : productId, productReviews : productReviews, message : `There are Total ${productReviews.length} Reviews`} : {productReviews : [],message : `There are Total 0 Reviews`}
    }
}


export default new ProductReviewService()