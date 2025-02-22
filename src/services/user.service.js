import User from "../database/schemas/user.schema.js"
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

}

export default new UserService()