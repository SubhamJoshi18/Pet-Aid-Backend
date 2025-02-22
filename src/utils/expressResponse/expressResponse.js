import statusCodes from 'http-status-codes'


async function handleNotFoundRoute(req,res){
    return res.status(statusCodes.NOT_FOUND).json({
        message : `${req.originalUrl} Does not Exists on the System, Please Try again Later`
    })
}

export {
    handleNotFoundRoute
}