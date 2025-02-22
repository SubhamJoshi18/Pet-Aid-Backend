import statusCode from 'http-status-codes'
import JwtHelper from '../libs/jsonwebToken.js'
import { petAidLogger } from '../libs/logger.js'

async function verifyAuthToken (req,res,next){

    const token = req.headers['Authorization'] ?? req.headers.authorization
    
    if(!token || token.length.toString().startsWith('0')) {
        return res.status(statusCode.BAD_GATEWAY).json({
            message : `Token is Required or Token is Missing`,
            error : true
        })
    }
    try{
        const decodedPayload = await JwtHelper.verifyAccessToken(token)
        req.user = decodedPayload
        next()
    }catch(err){
        petAidLogger.error(`Error on decoding the Token`,err) 
        process.exit(0)
    }
}


export {
    verifyAuthToken
}