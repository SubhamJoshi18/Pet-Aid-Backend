import MainApp from "./server.js";
import dotenv from 'dotenv'
import express from 'express'
import { petAidLogger } from "./libs/logger.js";
dotenv.config()

const app = express()
const port = process.env.PORT ?? 3000

async function startBackend(){  

    const appInstance = await MainApp.getInstance(port,app)
    const health = MainApp.checkStarted(port)

    if(!health){
        petAidLogger.error(`The Server has not been started, the server health : ${health}`)
        process.exit(0)
    }

    petAidLogger.info(`The Server Has been Started, The Current Status ${health}`)
}


(async () => {
    await startBackend()
})()

