import mongoose from "mongoose";
import { formmatedMongoose } from "../../utils/mongooseUtils/formattedMongoose.js";

const tokenSchema = new mongoose.Schema({

    tokenUuid : {
        type : String,
        required : [true,formmatedMongoose('Token UUID')]
    },

    user : {
        type  : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
},
{
    timestamps : true
})

const blockListTokenSchema = new mongoose.Schema({
    accessToken : {
        type : String,
        required : [true,formmatedMongoose('Access Token')]
    }
})



const Token = mongoose.model('Token',tokenSchema)
const BlockListToken = mongoose.model('BlockListToken',blockListTokenSchema)

export {
    Token,
    BlockListToken
}
