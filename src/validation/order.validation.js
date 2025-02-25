import mongoose from 'mongoose'
import {z} from 'zod'

const createOrderSchema = z.object({
    current_location : z.string(),
    destination_location : z.string(),
    delivery_price : z.number()
})

export {
    createOrderSchema
}


