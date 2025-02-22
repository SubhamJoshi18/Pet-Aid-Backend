import mongoose from "mongoose";

const productImageSchema = new mongoose.Schema({

        url: {
          type: String,
          required: [true, "Image URL is required"],
        },
        alt: {
          type: String,
          default: "Product Image",
        },

})


export default productImageSchema