class ApiError extends Error {
    constructor(
        statusCode,
        message = "Somewthinf went wrong",
        errors = [], // array of error messages for showing multiple errors
        stack = "" // this means if error stack is not there then it will be empty
    ){
        super(message)
        this.message = message
        this.statusCode = statusCode
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