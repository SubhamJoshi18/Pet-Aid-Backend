import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    fullName : {
        type : String,
        required : [true,'FullName is Required'],
    },

    email : {
        type : String,
        required:[true,'Email is Required'],
    },
    password : {
        type : String,
        required:[true,'Password is Required']
    },
    phone : {
        type : String,
        required : [true,'Phone Number is Required']
    },

    userProfile : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'UserProfile',
    },

    productWishList : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'ProductWishlist'
    }
},{
    timestamps : true
})

const User = mongoose.model('User',userSchema)



export default User
