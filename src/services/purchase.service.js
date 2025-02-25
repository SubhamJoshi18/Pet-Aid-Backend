import Product from "../database/schemas/products/product.schema.js"
import User from "../database/schemas/user.schema.js"
import { DatabaseExceptions } from "../exceptions/index.js"
import { v4 as uuidv4} from 'uuid'
import statusCode from 'http-status-codes'
import Transaction from "../database/schemas/orders/transaction.schema.js"


class PurchaseService {

    async purchaseProductService(productId,userId,content){

        const {transaction_amount} = content
        const productDoc = await Product.findOne({
            _id : productId
        })

        if(!productDoc) throw new DatabaseExceptions(`The Product Does not Exists on the System or It is already sold`,statusCode.BAD_REQUEST);

        const productStatus  = productDoc.status
        const isNotIdle = productStatus.startsWith('I') && productStatus.endsWith('e')
        if(!isNotIdle) throw new DatabaseExceptions(`Product is not Idle, It is already Purchased or Sold`,statusCode.BAD_REQUEST);
        
        const productCurrentPrice = productDoc.price
        
        const isGreaterThan = Math.ceil(productCurrentPrice) < Math.ceil(transaction_amount)
        const isLesserThan = Math.ceil(productCurrentPrice) > Math.ceil(transaction_amount)

        if(isGreaterThan || isLesserThan) throw new DatabaseExceptions(`The Transaction Amount should be same as the Product Price, Transaction Failed`,statusCode.BAD_REQUEST);

        const payment_corelationId = uuidv4()

        const purchase_user = await User.findOne({_id : userId})

        if(!purchase_user) throw new DatabaseExceptions(`The User does not exist on our system`,statusCode.BAD_REQUEST)

        const productDocIds = productDoc._id
        const userDocIds = purchase_user._id

        const payload = {
            transaction_amount,
            transaction_co_relation_id : payment_corelationId,
            transaction_issued_at : new Date(),
            product_purchased : productDocIds,
            transaction_by : userDocIds
        }
        const insertResult = await Transaction.create({
            ...payload
        })
        const inserted_co_relation_id = insertResult.transaction_co_relation_id
        
        const updatedProduct = await Product.updateOne(
            {
                _id : productDocIds
            },
            {
                status : 'Purchased'
            },
            {
                $new : true
            }
        )
        
        const validUpdated = updatedProduct.acknowledged && updatedProduct.matchedCount > 0;
        return validUpdated ?
        {
            payment_co_relation_id : inserted_co_relation_id,
            payment_id : insertResult._id
        } :
        {
            payment_co_relation_id : null,
            payment_id : null
        }



    }


    async getAllPurchaseProductService(userId) {

        const allPurchasedProductByUser = await Transaction.find({
                transaction_by:userId
        }).populate({
            path : 'product_purchased'
        })

        const filteredPurchasedProduct = allPurchasedProductByUser.filter((data) => new Array(data.product_purchased).filter((data) => data.status === 'Purchased'))
        const emptyArray = Array.isArray(filteredPurchasedProduct) && filteredPurchasedProduct.length === 0
        if(emptyArray) throw new DatabaseExceptions(`There is not Purchased Product For the User`)
        return {
            purchasedProduct : filteredPurchasedProduct
        }
    }

    async getAllTransactionService(userId){
        const allUserTransaction = await Transaction.find({
            transaction_by : userId
        }).populate({
            path : 'product_purchased'
        })
        const transactionPayload = allUserTransaction.map((data) => {
            return {
                amount : data.transaction_amount,
                transaction_id : data.transaction_co_relation_id,
                product_purchased : data.product_purchased,
                transaction_date : data.transaction_issued_at
            }
        })
        return {
            transactions : transactionPayload
        }
    }
}


export default new PurchaseService()