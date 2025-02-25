import Transaction from "../database/schemas/orders/transaction.schema"
import Product from "../database/schemas/products/product.schema"
import User from "../database/schemas/user.schema"
import { DatabaseExceptions } from "../exceptions"
import statusCode from 'http-status-codes'
import crypto from 'crypto'
import Order from "../database/schemas/orders/order.schema"

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

        const filteredRejection = dbPromiseArr.filter((data) => data.status !== 'fulfilled')
        
        if(Array.isArray(filteredRejection) && filteredRejection.length > 0) throw new DatabaseExceptions(`There is somse issue while updating or inserting the result`,statusCode.INTERNAL_SERVER_ERROR);

        const orderDoc = dbPromiseArr[0]``

        return {
            order : orderDoc,
        }
    }

}

export default new OrderService()