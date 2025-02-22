import statusCode from "http-status-codes"

const globalErrorHandler = (err, req, res , next) => {

   return res.status(statusCode.BAD_GATEWAY).json({
        error : true,
        message : err.message,
        stack : err.stack
   })

}


export {
    globalErrorHandler
}