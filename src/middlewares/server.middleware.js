import morgan from "morgan";
import cors from 'cors'
import express from 'express'
import corsConfig from "../config/corsConfig.js";


const serverMiddleware = (expressApp) => {

    expressApp.use(express.json())
    expressApp.use(express.urlencoded({extended:true}))
    expressApp.use(morgan('dev'))
    expressApp.use(cors(corsConfig))

}

export {
    serverMiddleware
}