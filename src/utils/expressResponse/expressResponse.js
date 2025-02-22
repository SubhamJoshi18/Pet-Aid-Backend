import statusCodes from 'http-status-codes'


async function handleNotFoundRoute(req,res){
    return res.status(statusCodes.NOT_FOUND).json({
        message : `${req.originalUrl} Does not Exists on the System, Please Try again Later`
    })
}

function sendApiResponse(res,data,message,statusCode){
    const payload = {
        data : data,
        message : message,
        statusCode : statusCode,
        error : false
    }
    return res.status(statusCode).json(payload)
}

export {
    handleNotFoundRoute,
    sendApiResponse
}