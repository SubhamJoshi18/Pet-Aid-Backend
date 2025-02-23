import mongoose from "mongoose";
import { formmatedMongoose } from "../../../utils/mongooseUtils/formattedMongoose.js";


const reviewProductSchema = new mongoose.Schema({

    reviewComment : {
        type : String,
        required : [true,formmatedMongoose('Review Comment')]
    },


    reviewRating :  {
        type : Number,
        required : [true,formmatedMongoose('Rating')]
    },


    productId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product'
    }
}, {
    timestamps : true
})

const ReviewProduct = mongoose.model('ReviewProduct',reviewProductSchema)
export default ReviewProduct