import mongoose from "mongoose";
const userProfileSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 200,
    },
    profilePicture: {
      type: String,
      default: "https://example.com/default-avatar.png",
    },
    location: {
      country : {
        type : String,
        default : '' 
      },
      city : {
        type : String,
        default : ''
      },
      postalCode : {
        type : Number,
        default : 0
      }
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required :[true,'User is Required']
    },

    isActive : {
      type : Boolean,
      default : true
    }
  },
  {
    timestamps: true, 
  }
);

const UserProfile = mongoose.model("UserProfile", userProfileSchema);
export default UserProfile;
