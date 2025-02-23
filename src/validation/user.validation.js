import {z} from 'zod'

const updateUserProfileSchema = z.object({

    username : z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be at most 50 characters")
    .optional(),

    bio :  z.string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be at most 50 characters")
    .optional(),

    location : z.object({

        country : z.string()
        .min(2, "Full name must be at least 2 characters")
        .max(50, "Full name must be at most 50 characters")
        .optional(),

        city :  z.string()
        .min(2, "Full name must be at least 2 characters")
        .max(50, "Full name must be at most 50 characters")
        .optional(),

        postalCode : z.number().optional()
    })

})


export {
    updateUserProfileSchema
}