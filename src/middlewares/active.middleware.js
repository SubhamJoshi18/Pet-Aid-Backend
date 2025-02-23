import User from "../database/schemas/user.schema.js"
import UserProfile from "../database/schemas/userProfile.schema.js"
import { petAidLogger } from "../libs/logger.js"
import { BadGatewayExceptions } from "../exceptions/index.js"


async function checkUserisActive (req,res,next)  {
    const userId = req.user.userId
    try{
        const userDoc = await User.findOne({_id : userId})
        const userDocId = userDoc._id ?? userId
        const userProfileDoc = await UserProfile.findOne({
            user : userDocId
        })

        const status = userProfileDoc.isActive
        const validStatus = typeof status === 'boolean' && status

        if(validStatus) {
            petAidLogger.info(`The User is Active`)
            next()
        }else{
            throw new BadGatewayExceptions(`The User is not Active, It is Deactivated, Please Active it.`)
        }

    }catch(err){
        next(err)
    }
}

export {
    checkUserisActive
}