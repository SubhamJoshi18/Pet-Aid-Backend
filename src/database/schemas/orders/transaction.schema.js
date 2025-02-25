import mongoose from "mongoose";
import { formmatedMongoose } from "../../../utils/mongooseUtils/formattedMongoose.js";

const transactionSchema = new mongoose.Schema({
    
    transaction_amount : {
        type : Number,
        required : [true,formmatedMongoose('Transaction Amount')]
    },

    transaction_co_relation_id : {
        type : String,
        required : [true,formmatedMongoose('Transaction Co Relation Id')]
    },

    transaction_issued_at : {
        type : Date,
        required : [true,formmatedMongoose("Transaction Issued At")],
    },

    product_purchased : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product'
    },

    transaction_by : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : [true,formmatedMongoose('Transaction By')]
    },


},{
    timestamps : true
})

const Transaction = mongoose.model('Transaction',transactionSchema)
export default Transaction