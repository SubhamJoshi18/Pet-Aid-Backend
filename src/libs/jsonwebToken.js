import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()


class JWTHelper {

    async createAccessToken (payload) {
        const options = {
                issuer : 'Bhuwan Joshi',
                expiresIn : '1h'
        }

        const secretKey = process.env.JWT_ACCESS_TOKEN ?? 'access'

        const decodedToken = jwt.sign(payload,secretKey,options)
        return decodedToken
    }

    async createRefreshToken (payload) {
        const options = {
                issuer : 'Bhuwan Joshi',
                expiresIn : '1d'
        }

        const secretKey = process.env.JWT_REFRESH_TOKEN ?? 'refresh'
        const decodedToken = jwt.sign(payload,secretKey,options)
        return decodedToken  
    }

    async verifyAccessToken(token){
        const secretKey = process.env.JWT_ACCESS_TOKEN ?? 'access'
        const decodedPayload =jwt.verify(token,secretKey)
        return decodedPayload
    }
}


export default new JWTHelper()