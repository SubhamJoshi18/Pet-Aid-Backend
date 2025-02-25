import Transaction from "../database/schemas/orders/transaction.schema.js"
import Product from "../database/schemas/products/product.schema.js"
import User from "../database/schemas/user.schema.js"
import { DatabaseExceptions } from "../exceptions/index.js"
import statusCode from 'http-status-codes'
import crypto from 'crypto'
import Order from "../database/schemas/orders/order.schema.js"
import { generateOrderHtmlContent, orderSubject } from "../constants/smtp.js"
import { sendEmail } from "../libs/smtp.js"

class OrderService {

    async orderProductService(parseContent,productId,corelationId){

        const {current_location, destination_location,  delivery_price } = parseContent 

        const productDoc = await Product.findOne({
            _id : productId
        })

        if(!productDoc) throw new DatabaseExceptions(`The Product Does not Exists on our System`,statusCode.ACCEPTED);

        const productPrice = productDoc.price

        const paymentDoc = await Transaction.findOne({
            transaction_co_relation_id : corelationId
        }).populate({
            path : 'product_purchased'
        })
        

        if(!paymentDoc) throw new DatabaseExceptions(`Payment Does not Exists for this Product`,statusCode.BAD_REQUEST);
        

        const isSameLocation = current_location.trim() === destination_location.trim()
        
        if(isSameLocation) throw new DatabaseExceptions(`Cannot Place the Order at the Same Location`,statusCode.BAD_REQUEST);
        
        const userId = paymentDoc.transaction_by
        
        const userDoc = await User.findOne({_id : userId})

        if(!userDoc) throw new DatabaseExceptions(`The User Does not Exists on our System`,statusCode.BAD_REQUEST);


        const secretKey = 'secret'
 
        const createHashForPayment = (data, algorithm,secretKey) => {
            const hash = crypto.createHash(algorithm,secretKey)
            hash.update(JSON.stringify(data))
            return hash.digest('hex')
        }
       
        const paymentHash =createHashForPayment(paymentDoc,'sha256',secretKey)

        const productDocId = productDoc._id
        const userDocId = userDoc._id

        const payload = {
            order_date : new Date(),
            current_location,
            delivery_price,
            destination_location,
            product_price : productPrice,
            product : productDocId,
            order_by : userDocId,
            delivery_status : 'Ongoing',
            uniqueOrderId : paymentHash
        }


        const dbPromiseArr =  await Promise.allSettled(
            [
                Order.create({...payload}),
                Product.updateOne({_id : productDocId},{status : 'Ongoing'},{$new : true})
            ]
        )

        const productItems = new Array({
            name : productDoc.name,
            price : productDoc.price,
            category : productDoc.category
        })

        const trackProductUrl = `http://localhost:3000/api/order`

        const producthtmlContent = generateOrderHtmlContent(productItems,trackProductUrl,paymentHash,productPrice)

        const sendEmailContent = await sendEmail(userDoc.email,orderSubject,`Order Confirmation For ${userDoc.fullName}`,producthtmlContent)

        const filteredRejection = dbPromiseArr.filter((data) => data.status !== 'fulfilled')
        
        if(Array.isArray(filteredRejection) && filteredRejection.length > 0) throw new DatabaseExceptions(`There is somse issue while updating or inserting the result`,statusCode.INTERNAL_SERVER_ERROR);

        const orderDoc = dbPromiseArr[0]['value']

        return {
            order : orderDoc,
        }
    }
    

    async getAllUserProduct(userId){
            const allOrderByUser = await Order.find({
                order_by : userId
            })

            if(allOrderByUser && allOrderByUser.length === 0) throw new DatabaseExceptions(`The User Does not have any Order Product`,statusCode.BAD_REQUEST);

            return {
                orders : allOrderByUser
            }
    }

    async cancelOrderService(orderId) {

        const orderDoc = await Order.findOne({
            uniqueOrderId : orderId
        })

        const orderStatus = orderDoc.delivery_status
        const isAlreaadyDone = orderStatus.includes('Done')
        if(isAlreaadyDone) throw new DatabaseExceptions(`The Order is already Done , Cannot be Cancel`,statusCode.BAD_REQUEST);

        const updatedResult = await Order.updateOne(
            {
                uniqueOrderId : orderId
            },
            {   
                delivery_status : 'Cancel'
            },
            {
                $new : true
            }
        )

        const validupdated = updatedResult.acknowledged && updatedResult.matchedCount > 0
        
        if(validupdated){
            return {
                message : `The Order Have Been Cancel`,
                updatedResult
            }
        }else{
            return {
                message : `There is issue updating the delivery status`,
                updatedResult : null
            }
        }

    }
}


export default new OrderService()