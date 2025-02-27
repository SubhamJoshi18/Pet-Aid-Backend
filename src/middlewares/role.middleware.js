import { petAidLogger } from "../libs/logger.js"
import { RoleExceptions } from "../exceptions/index.js"
import statusCode from 'http-status-codes'


async function isRider (req,_res,next) {
    const userRole = req.user.isRider
   try{
    if(typeof userRole === 'boolean' && userRole) {
        petAidLogger.info(`The User is Rider, Permitting the Access`)
        next()
    }else{
        throw new RoleExceptions(`The Role Does not Have Access to permit this controller`,statusCode.BAD_REQUEST);
    }
   }catch(err){
    next(err)
   }
}

export {
    isRider
}