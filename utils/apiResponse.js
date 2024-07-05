class ApiResponse{
    constructor(
        data=null,
        statusCode=200,
        message="success"
    ){
        this.data=data,
        this.statusCode=statusCode
        this.success=statusCode<400
        this.message=message
    }
}
export {ApiResponse}