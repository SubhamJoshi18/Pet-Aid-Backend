import express from 'express'
import { serverRouter } from './router/server.routes.js'
import { serverMiddleware } from './middlewares/server.middleware.js'
import { petAidLogger } from './libs/logger.js'

class MainApp {

    static appInstance = new Map()

    constructor(serverPort,expressApp) {
        this.serverPort = serverPort
        this.expressApp = expressApp
        this.initializeExpress(expressApp)
    }

     static async getInstance(serverPort,expressApp){
        if(!this.appInstance.has(serverPort)){
            this.appInstance.set(serverPort,new MainApp(serverPort,expressApp))
        }
        return this.appInstance.get(serverPort)
     }


     async initializeExpress(expressApp){
            serverMiddleware(expressApp)
            serverRouter(expressApp)
            try{
                this.expressApp.listen(this.serverPort,() => {
                    petAidLogger.info(`Pet Aid Backend Server is running on ${this.serverPort}`)
                })
            }catch(err){
                petAidLogger.error(`There is some issue while starting the express server`,err)
                process.exit(0)
            }      
     }


     static checkStarted(serverPort){
        let validStart = true
        const isOccupiedPort = this.appInstance.get(serverPort)
        if(isOccupiedPort){
            return validStart
        }
        return validStart
     }

    
}


export default MainApp