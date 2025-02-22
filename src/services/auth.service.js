import User from "../database/schemas/user.schema.js"
import UserProfile from "../database/schemas/userProfile.schema.js"
import { DatabaseExceptions, ValidationExceptions } from '../exceptions/index.js'
import BcryptHelper from "../libs/bcrypt.js"
import JwtHelper from "../libs/jsonwebToken.js"
import statusCode from 'http-status-codes'

class AuthServices {


    async signUpService(content){

        const {fullName, email, password, phone} = content 
        
        const checkPromise = await Promise.allSettled([
            User.findOne({
                fullName : fullName
            }),
            User.findOne({
                email : email
            })
        ]) 

        const filteredUnRejected = checkPromise.filter((data) => data.status !== 'rejected')

        const validArray = Array.isArray(filteredUnRejected) && filteredUnRejected.length > 0
        
        if(validArray){
            const userNameExists = filteredUnRejected[0]['status'].includes('fulfilled') ? filteredUnRejected[0]['value'] : null
            const userEmailExists = filteredUnRejected[1]['status'].includes('fulfilled') ? filteredUnRejected[1]['value'] : null
            if(userEmailExists || userNameExists) {
                    throw new DatabaseExceptions(`The User Name or User Email is already Exists, Please Try a new Email or Username`,statusCode.BAD_GATEWAY)
            }
            
        }

        const isvalidNepaliNums = typeof phone === 'string' && phone.toString().startsWith('9') 

        if(!isvalidNepaliNums){
            throw new ValidationExceptions(`The Number you have Entered is not appropriate Nepali Numbers`,statusCode.BAD_GATEWAY)
        }

        const extractFirstName = fullName.split(' ')[0]
        const hashPassword = await BcryptHelper.hashPassword(password)

        const payloadToCreate  = {
            fullName,
            email,
            password : hashPassword,
            phone
        }

        const savedResult = await User.create({
            ...payloadToCreate
        })

        const savedUserId = savedResult?._id

        const savedUserProfile = await UserProfile.create({
            username : extractFirstName,
            user : savedUserId
        })

        savedResult.userProfile = savedUserProfile._id
        await savedResult.save()

        const validInserted = savedResult._id !== null && savedUserProfile._id !== null

        return validInserted ? {
            userResult : savedResult,
            userProfieResult : savedUserProfile
        } : {
            result : null
        }
    }

    async signInService(content){
        const {email , password }  = content

        const checkEmailExists = await User.findOne({
            email : email
        }).populate('userProfile')

        if(!checkEmailExists) {
            throw new DatabaseExceptions(`The Email : ${email} Does not Exists, Please Try again`,statusCode.BAD_REQUEST)
        }

        const extractedPayload = new Array(checkEmailExists).map((data) => {
            return {
                fullName : data.fullName,
                email : data.email,
                role : data.userProfile.role,
                phoneNumber : data.phone
            }
        }).pop()

        const newPassword = typeof password === 'string' && password.length > 0 ? password.trim() : ''
        const oldPassword = checkEmailExists.password
        const checkPassword = await BcryptHelper.comparePassword(newPassword,oldPassword)

        if(typeof checkPassword === 'boolean' && !checkPassword) {
            throw new DatabaseExceptions(`The Password you have entered is invalid, Please Try again`,statusCode.BAD_REQUEST)
        }
        const accessToken = await JwtHelper.createAccessToken(extractedPayload)
        const refreshToken = await JwtHelper.createRefreshToken(extractedPayload)

        return {
            accessToken : accessToken,
            refreshToken : refreshToken
        }
    }
}   

export default new AuthServices()