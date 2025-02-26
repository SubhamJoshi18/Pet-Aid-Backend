import Rider from "../database/schemas/riders/rider.schema.js"
import statusCode from 'http-status-codes'
import { DatabaseExceptions } from "../exceptions/index.js"
import User from "../database/schemas/user.schema.js"
import Order from "../database/schemas/orders/order.schema.js"
import UserProfile from "../database/schemas/userProfile.schema.js"
import statusCode from 'http-status-codes'

class RiderService {

    async createRiderService(userId,content){

        const { riderName }  = content
        
        const riderExists = await Rider.findOne({
            riderName : riderName
        })

        if(riderExists) throw new DatabaseExceptions(`The Rider Name is already Exists`,statusCode.BAD_GATEWAY);


        const userDoc = await User.findOne({
            _id : userId
        }) 

        if(!userDoc) throw new DatabaseExceptions(`The User Document does not Exists on the System`,statusCode.BAD_GATEWAY)

        
        const userFullName = userDoc.fullName

        const isSameName = userFullName.includes(riderName) && riderName === userFullName

        if(isSameName) throw new DatabaseExceptions(`User cannot have the same name as the Rider Name`,statusCode.BAD_REQUEST);
        

        const userIds = userDoc._id

        const insertPayload = {
            riderName,
            user : userDoc
        }

        const insertResult = await Rider.create({
                ...insertPayload
        })

        const updatedRiderStatus = await Promise.allSettled([
            User.updateOne(
                {
                    _id : userIds
                },
                {
                    isRider : true
                },
                {
                    $new : true
                }
            ),
            UserProfile.updateOne(
                {
                    user : userIds
                },
                {
                    role : 'rider'
                },
                {
                    $new : true
                }
            )
        ])

        const validUpdated = updatedRiderStatus[0]['value'].acknowledged && updatedRiderStatus[0]['value'].matchedCount > 0;

        return validUpdated ?
        {
            updateStatus : validUpdated,
            insertResult : insertResult
        } :
        {
            updateStatus : null,
            insertResult : null
        }

    }

    async getAllOrders(){
        const allOrder = await Order.find({
        })

        if(allOrder && allOrder.length === 0) throw new DatabaseExceptions(`There are not any Orders`,statusCode.BAD_REQUEST);

        return {
            orders : allOrder
        }
    }

    async applyOrders(orderId,userId){

        const checkOrder = await Order.findOne({
            _id : orderId
        })

        if(!checkOrder) throw new DatabaseExceptions(`The Order is already Expired or The Order Does not Exists`,statusCode.ACCEPTED);

        console.log(checkOrder)



    }


}

export default new RiderService()