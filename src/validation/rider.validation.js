import {z} from 'zod'

const createRiderSchema = z.object({
    riderName : z.string()
})

export {
    createRiderSchema
}