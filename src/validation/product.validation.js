import {z} from 'zod'

const productCreateSchema = z.object({
    name : z.string(),
    description : z.string(),
    category : z.string(),
    price : z.number(),
    tags : z.array(z.string()),
})


const updateProductSchema = z.object({
    name : z.string(),
    description : z.string(),
    category : z.string(),
    price : z.number(),
    tags : z.array(z.string()),
})


const createProductReviewScehma = z.object({
    reviewComment : z.string(),
    reviewRating : z.number()
})

export {
    productCreateSchema,
    updateProductSchema,
    createProductReviewScehma
}