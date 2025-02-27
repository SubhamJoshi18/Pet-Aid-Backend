import mongoose from "mongoose";
import { formmatedMongoose } from "../../../utils/mongooseUtils/formattedMongoose.js";

const orderSchema = new mongoose.Schema({
    order_date : {
        type : Date,
        required : [true,formmatedMongoose('Order Date')]
    },

    current_location : {
        type : String,
        required : [true,formmatedMongoose('Current Location')]
    },
    destination_location : {
        type : String,
        required: [true,formmatedMongoose('Destination Location')]
    },

    delivery_price : {
        type : Number,
        required : [true,formmatedMongoose('Delivery Price')]
    },

    uniqueOrderId : {
        type : String,
        required : [true,formmatedMongoose('Unique Order Id')]
    },

    delivery_status : {
        type : String,
        enum : ['Cancel','Done','Ongoing','Idle','Rider Delivering'],
        default : 'Idle'
    },
    
    product_price : {
        type : Number,
        required : [true,formmatedMongoose('Product Price')]
    }
    ,
    product : {
        type  : mongoose.Schema.Types.ObjectId,
        ref : 'Product'
    },
    order_by : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },


})

const Order = mongoose.model('Order',orderSchema)
export default Order