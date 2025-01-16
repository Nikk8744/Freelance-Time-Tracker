class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong ",
        errors = [], // array of error messages for showing multiple errors
        stack = "" // this means if error stack is not there then it will be empty
    ){
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.errors = errors
        this.data = null
        this.success = false;

        if(stack){
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { ApiError }