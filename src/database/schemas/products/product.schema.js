import mongoose from "mongoose";
import { formmatedMongoose } from "../../../utils/mongooseUtils/formattedMongoose.js";
import productImageSchema from "./productImage.schema.js";

const productSchema = new mongoose.Schema({

    name : {
        type : String,
        required :[true,formmatedMongoose('Name')]
    },

    description : {
        type : String,
        required : [true,formmatedMongoose('Description')]
    },

    category: {
        type: String,
        required: [true, formmatedMongoose("Category")],
    },

    price : {
        type : Number,
        required : [true,formmatedMongoose('Price')]
    },

    images: [
        productImageSchema
      ],

    tags: {
        type: [String], 
        default: [],
      },
  
    isFeatured: {
        type: Boolean,
        default: false,
      },
  
    isDeleted: {
        type: Boolean,
        default: false, 
      },

     isUpdated : {
        type : Boolean,
        default : false
     },
    reviewProduct : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'ReviewProduct',
    }],
    corelationId : {
        type : String,
        required : [true,formmatedMongoose('Co-RelationId')]
    }
},
{
    timestamps : true
})


productSchema.index({name : 1})
const Product = mongoose.model('Product',productSchema)
export default Product