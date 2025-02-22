

const globalErrorHandler = (err, req, res , next) => {

   console.log(err)
   next()
}


export {
    globalErrorHandler
}