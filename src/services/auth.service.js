import { generateHtmlContent, subject } from "../constants/smtp.js"
import User from "../database/schemas/user.schema.js"
import UserProfile from "../database/schemas/userProfile.schema.js"
import { DatabaseExceptions, ValidationExceptions } from '../exceptions/index.js'
import BcryptHelper from "../libs/bcrypt.js"
import JwtHelper from "../libs/jsonwebToken.js"
import statusCode from 'http-status-codes'
import {v4 as uuidv4} from 'uuid'
import { sendEmail } from "../libs/smtp.js"
import { BlockListToken, Token } from "../database/schemas/token.schema.js"

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
                userId : data._id,
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

    async forgetPassword (content) {
        const {email} = content
        const isEmailExists = await User.findOne({
            email : email
        })
        if(!isEmailExists) throw new DatabaseExceptions(`Email Does not Exists, Please Try a valid Email`,statusCode.BAD_REQUEST);
        let corelationIdAuth = uuidv4()
        
        const existsToken = await Token.findOne({
            tokenUuid : corelationIdAuth
        })

        if(existsToken) corelationIdAuth = uuidv4();

        const userId = isEmailExists._id
        const insertResult = await Token.create({
            tokenUuid : corelationIdAuth,
            user : userId
        })

        const url = `http://localhost:${process.env.PORT}/api/reset-password/${corelationIdAuth}/${userId}`
        const htmlContent = generateHtmlContent(url)
        const sendMail = await sendEmail(email,subject,`Password Reset Confirmation`,htmlContent)
        return {
            message : `The Password Reset link has sent successfully`
        }
    }


    async checkResetToken(tokenId){
        const tokenExists = await Token.findOne({tokenUuid : tokenId})
        if(!tokenExists) throw new DatabaseExceptions(`The Token Does not Exists or it is already Expired`)
        return tokenExists
    }


    async resetPassword(tokenId,userId,content) {
        const {password} = content
        const userDoc = await User.findOne({
            email : email
        })

        if(!userDoc) throw new DatabaseExceptions(`The User Does not Exists on the System`,statusCode.BAD_REQUEST);
        const tokenExists = await Token.findOne({tokenUuid : tokenId})
        if(!tokenExists) throw new DatabaseExceptions(`The Token Does not Exists or The Token is already Expired`,statusCode.BAD_GATEWAY)
        const hashNewPassword = BcryptHelper.hashPassword(password)
        const oldPassword = userDoc.password
        const isSamePassword = BcryptHelper.comparePassword(password,oldPassword)
        if(isSamePassword){
            throw new DatabaseExceptions(`The Password you have entered matches with your old Passowrd, Try a new one`,statusCode.BAD_GATEWAY)
        }
        const updatedResult = await User.updateOne(
            {
                _id : userDoc._id ?? userId
            },
            {
                password : hashNewPassword
            },
            {
                $new : true
            }
        )
        const validUpdated = updatedResult.acknowledged && updatedResult.matchedCount > 0;
        return validUpdated ? 
        {
            data : updatedResult,
            message : `The Password has been Reset`
        }:
        {
            data : null,
            message : `There is some issue while updating the new password`
        }
    }

    async logoutServices(accessToken) {

        const accessTokenExists = await BlockListToken.findOne({
            accessToken : accessToken
        })
        if(accessTokenExists) {
            throw new DatabaseExceptions(`The Token is already Blocked`,statusCode.BAD_REQUEST)
        }
        const createToken = await BlockListToken.create({
            accessToken : accessToken
        })
        return createToken
    }

}   

export default new AuthServices()