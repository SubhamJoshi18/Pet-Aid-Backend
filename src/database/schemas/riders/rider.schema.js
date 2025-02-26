import mongoose from "mongoose";
import { formmatedMongoose } from "../../../utils/mongooseUtils/formattedMongoose.js";

const riderSchema = new mongoose.Schema({

        riderName : {
            type : String,
            required : [true,formmatedMongoose('Rider Name')]
        },

        riderOrders : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Order',
            }
        ],

        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required : [true,formmatedMongoose('User')]
        },

},
{
    timestamps : true
})


const Rider = mongoose.model('Rider',riderSchema)
export default Rider