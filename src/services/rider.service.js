import Rider from "../database/schemas/riders/rider.schema.js"
import statusCode from 'http-status-codes'
import { DatabaseExceptions } from "../exceptions/index.js"
import User from "../database/schemas/user.schema.js"
import Order from "../database/schemas/orders/order.schema.js"
import UserProfile from "../database/schemas/userProfile.schema.js"
import Product from "../database/schemas/products/product.schema.js"
import { generateOrderCompleteContent, generateRiderOrderHtmlContent } from "../constants/smtp.js"
import { sendEmail } from "../libs/smtp.js"

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
            user : userIds
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

        
        const currentDate = new Date()
        
        const orderDate = checkOrder.order_date
        
        const isGreaterThanCurrentDate = currentDate > orderDate
        
        // if(isGreaterThanCurrentDate) throw new DatabaseExceptions(`The Current Date is greater than the Order Date, Order is Expired`,statusCode.BAD_GATEWAY);
        
        const orderStatus = checkOrder.delivery_status
        
        const isOngoing = orderStatus.includes('Rider Delivering')
        
        if(isOngoing) throw new DatabaseExceptions(`The Order is already Delivered by Riders`,statusCode.BAD_REQUEST);

        const productId = checkOrder.product

        const orderUserId = checkOrder.order_by

        const orderUser = await User.findOne({
            _id : orderUserId
        })

        const productDoc = await Product.findOne({
            _id : productId
        })



        const updateOrderResult = await Order.updateOne(
            {
                _id : orderId
            },
            {
                delivery_status : 'Rider Delivering'
            },{
                $new : true
            }
        ) 

        const updateProductResult = await Product.updateOne(
            {
                _id : productId
            },
            {   
                status : 'Delivering'
            },
            {
                $new : true
            }
        )

        const riderOrderContent = generateRiderOrderHtmlContent(orderId,orderDate,productDoc.name,productDoc.price)
        const subject = 'Rider Has Received Your Orders'
        const text = 'Deliver Rider Status'
        await sendEmail(orderUser.email,subject,text,riderOrderContent)
        return {
            message : 'The Order have been place For Delivering'
        }
    }

    async completeOrderRideService(orderId,userId){

        const orderDetails = await Order.findOne({
            _id : orderId
        })

        if(!orderDetails) throw new DatabaseExceptions(`The Order is already Deliver or The Order is already Expired`,statusCode.BAD_GATEWAY);

        const productId = orderDetails.product
        const orderUserId = orderDetails.order_by

        const dbPromiseArr = await Promise.allSettled(
            [
                Product.findOne({_id : productId}),
                User.findOne({_id : orderUserId})
            ]
        )

        const filteredUnRejected = Array.isArray(dbPromiseArr) ? dbPromiseArr.filter((data) => !data.status === 'rejected') : []
        
        const validPromise = filteredUnRejected.length > 0

        if(validPromise) {

            const productDoc = filteredUnRejected[0]['value']
            const orderUserDoc = filteredUnRejected[1]['value']

            const updateOrderStatus = await Order.updateOne(
                {
                    _id : orderId
                },  
                {
                    delivery_status : 'Done'
                },{
                    $new : true
                }
            )

            const updateProductStatus = await Product.updateOne(
                {
                    _id : productId
                },  
                {
                    status : 'Sold'
                },
                {
                    $new : true
                }
            )

            const updatedOrders = await Order.findOne({_id : orderId})


            const riderDocuments = await Rider.findOne({user : userId})
            

            const updateRiderStatus = await Rider.updateOne(
                {
                    _id : riderDocuments._id
                },  
                {
                    $push : {riderOrders : updatedOrders._id}
                },{
                    $new : true
                }
            )   
            
            const orderCompletehtmlContent = await generateOrderCompleteContent(orderId,productDoc.name,orderDetails.order_date,productDoc.price,productDoc._id)
            const subject = 'Order Deliver Succesfully'
            const text = 'Order Delvier Status'
            await sendEmail(orderUserDoc.email,subject,text,orderCompletehtmlContent)

            return {
                message : `The Order have been Delivered`,
                orderStatus : updatedOrders.delivery_status
            }

        }

        return {
            message : `Issue while marking the Order as Completed`,
            data : null
        }
        

    }

}

export default new RiderService()