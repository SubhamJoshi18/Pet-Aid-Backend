import {z} from 'zod'

const purchaseProductSchema = z.object({
    transaction_amount : z.number(),  
})

export {
    purchaseProductSchema
}