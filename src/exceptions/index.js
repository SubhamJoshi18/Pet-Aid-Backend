

class HttpException extends Error {

    status = 'Pending'
    OperationalError = false
    statusCode = 0


    constructor(message,statusCode){
        super(message)
        this.name = 'HttpExceptions'
        this.message = message
        this.statusCode = statusCode
        this.status = statusCode.toString().startsWith('4') ? 'Failed Operational' : 'Good Operational'
        this.OperationalError = true
        Object.setPrototypeOf(this,new.target.prototype)
    }


    getMessage(){
        return this.message
    }
}



class DatabaseExceptions extends HttpException {

    message = ''
    statusCode = 0

    constructor(message, statusCode) {
        super(message,statusCode)
        this.message  = message
        this.statusCode = statusCode
        this.name = 'Database  Exceptions'
        Object.setPrototypeOf(this,new.target.prototype)
    }

}

class ValidationExceptions extends HttpException {

    message = ''
    statusCode = 0

    constructor(message, statusCode) {
        super(message,statusCode)
        this.message  = message
        this.statusCode = statusCode
        this.name = 'Validation  Exceptions'
        Object.setPrototypeOf(this,new.target.prototype)
    }

}


class BadGatewayExceptions extends HttpException {
    message = ''
    statusCode = 0

    constructor(message,statusCode) {
        super(message,statusCode)
        this.message = message
        this.statusCode = statusCode
        this.name = 'Bad Gateway Exceptions'
        Object.setPrototypeOf(this,new.target.prototype)
    }
}

class RoleExceptions extends HttpException {
    message = ''
    statusCode = 0

    constructor(message,statusCode){
        super(message,statusCode)
        this.message = message
        this.statusCode = statusCode
        this.name = 'Role Exceptions'
        Object.setPrototypeOf(this,new.target.prototype)
    }
}


export {
    DatabaseExceptions,
    ValidationExceptions,
    BadGatewayExceptions,
    RoleExceptions
}