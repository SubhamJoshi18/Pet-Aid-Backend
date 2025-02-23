import mongoose from "mongoose";
import { formmatedMongoose } from "../../../utils/mongooseUtils/formattedMongoose.js";

const wishlistSchema = new mongoose.Schema({
    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product'
    },

    addedBy : {
        type : String,
        requried:[true,formmatedMongoose('Added bY')]
    }
},
{
    timestamps : true
})




const ProductWishlist = mongoose.model('ProductWishlist',wishlistSchema)
export default ProductWishlist