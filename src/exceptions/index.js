

class HttpException extends Error {

    status = 'Pending'
    OperationalError = false


    constructor(message){
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
        super(message)
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
        super(message)
        this.message  = message
        this.statusCode = statusCode
        this.name = 'Validation  Exceptions'
        Object.setPrototypeOf(this,new.target.prototype)
    }

}


export {
    DatabaseExceptions,
    ValidationExceptions
}