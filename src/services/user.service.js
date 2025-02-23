import User from "../database/schemas/user.schema.js"
import UserProfile from "../database/schemas/userProfile.schema.js";
import { DatabaseExceptions } from "../exceptions/index.js";
import statusCode from 'http-status-codes'


class UserService {

    async getUserProfile(userId){

        const userDoc = await User.findOne({
            _id : userId
        }).populate('userProfile')

        if(!userDoc){
            throw new DatabaseExceptions(`The User Does not Exists on the System`,statusCode.BAD_GATEWAY)
        }

        return userDoc

    }

    async deactivateUserProfile(userId) {

        const userDoc = await User.findOne({
            _id : userId
        }).populate('userProfile')

        const isActiveStatus = userDoc.userProfile.isActive
        if(typeof isActiveStatus === 'boolean' && !isActiveStatus) {
            throw new DatabaseExceptions(`The User is not Activate, The User is already Deactivated`,statusCode.BAD_GATEWAY) 
        }

        const userDocId = userDoc._id
        const userProfileDoc = await UserProfile.findOne({
            user : userDocId ?? userId
        })

        if(!userProfileDoc) {
            throw new DatabaseExceptions(`The User Credentials or User Profile Credential is Missing`,statusCode.BAD_GATEWAY)
        }

        const updatedResult = await UserProfile.updateOne({
            user : userId || userDocId
        }, {
            isActive : false
        },
        {
            $new : true         
        })

        const validUpdateResult = updatedResult.acknowledged && updatedResult.matchedCount > 0

        return validUpdateResult  ? 
        {
            updated_data : updatedResult,
            message : `The User ${userDoc.fullName} Has been Deactivated`
        } : 
        {
            updated_data : null,
            message : null
        }
    }


    async activateUserProfile(userId) {
        const userDoc = await User.findOne({
            _id : userId
        }).populate('userProfile')
        
        if(!userDoc) {
            throw new DatabaseExceptions(`The User Does not Exists on the System, Please try a valid User`,statusCode.BAD_GATEWAY)
        }

        const isDeactivateStatus = userDoc.userProfile.isActive
        
        if(isDeactivateStatus){
            throw new DatabaseExceptions(`The User is already Activated`,statusCode.BAD_GATEWAY)
        }

        const userDocId = userDoc._id
        const userProfileDoc = await UserProfile.findOne({user : userDocId ?? userId})
        
        if(!userProfileDoc) {
            throw new DatabaseExceptions(`The User Credentials or User Profile Credential is Missing`,statusCode.BAD_GATEWAY)
        }

        const updatedResult = await UserProfile.updateOne({
            user : userId || userDocId
        }, {
            isActive : true
        },
        {
            $new : true         
        })

        const validUpdateResult = updatedResult.acknowledged && updatedResult.matchedCount > 0

        return validUpdateResult  ? 
        {
            updated_data : updatedResult,
            message : `The User ${userDoc.fullName} Has been Activated`
        } : 
        {
            updated_data : null,
            message : null
        }


    }


    async updateUserProfile(userId,payloadUpdate){

        const validPayload = Object.entries(payloadUpdate).length > 0
        const validUpdatedPayload = typeof payloadUpdate === 'object' && Object.keys(payloadUpdate).length > 0
        
        if(!validPayload || !validUpdatedPayload){
            throw new DatabaseExceptions(`There is nothing to be updated`,statusCode.BAD_REQUEST)
        }

        const userPromiseArr = await Promise.allSettled(
            [
                User.findOne({_id : userId}),
                UserProfile.findOne({user : userId})
            ]
        )

        const validUserPromise = Array.isArray(userPromiseArr) && userPromiseArr.length > 0
        if(!validUserPromise) {
            throw new DatabaseExceptions(`The User Promise is not a valid Array`,statusCode.BAD_GATEWAY)
        }
        const filteredRejection = userPromiseArr.filter((data) => data.status !== 'fulfilled')

        if(Array.isArray(filteredRejection) && filteredRejection.length > 0) {
            throw new DatabaseExceptions(`There is some error while fetching the user details`,statusCode.BAD_GATEWAY)
        }

        const userDoc = userPromiseArr[0]['value']
        const userProfileDoc = userPromiseArr[1]['value']

        const userDocId = userDoc._id.toString()
        
        const updateResult = await UserProfile.updateOne(
            {
                user : userDocId ?? userId
            },
            {
                ...payloadUpdate
            },
            {
                $new : true
            }
        )

        const validUpdateResult = updateResult.acknowledged && updateResult.matchedCount > 0
        return validPayload ? 
        {
            message : `The User Profile has been updated`,
            updatedStatus : validUpdateResult,
            updateResult : updateResult
        } : 
        {
            message : `The User Profile Cannot not be Updated`,
            updatedStatus : false,
            updateResult : null
        }
    }
}

export default new UserService()