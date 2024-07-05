class ApiError extends Error{
    constructor(
        errors=[],
        stack="",
        message="Something Went Wrong",
        statusCode=500
    ){
        super(message)
        this.statusCode=statusCode,
        this.message=message,
        this.success=false,
        this.errors=errors
        this.stack=stack|| Error.captureStackTrace(this,this.constructor)
    }
}
export {ApiError}