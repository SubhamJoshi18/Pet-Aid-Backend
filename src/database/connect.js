import mongoose from "mongoose";
import dotenv from 'dotenv'
import { petAidLogger } from "../libs/logger.js";
dotenv.config()

export default async function connectMongoDB(){
    let retryCount = 0
    let retryStatus = true

    while(retryCount < 4 && retryStatus) {
        try{
            const url = process.env.MONGO_URL
            const mongooseConnection = await mongoose.connect(url)
            return mongooseConnection
        }catch(err){
            const isMaximumRetry = retryCount.toString().startsWith('4')

            if(isMaximumRetry){
                petAidLogger.error(`The Maximum Retry Count is Exceeded, Retry Status : ${!retryStatus}`)
                process.exit(0)                
            }
            petAidLogger.info(`Database Cannot be Connected, Increaseing Retry Count From ${retryCount} to ${retryCount + 1}`)
            retryCount += 1
            continue
        }
    }
    
}