class ApiResponse {
    constructor(statusCode, data = null, message = 'Success') {
        this.success = statusCode < 400
        this.statusCode = statusCode
        this.data = data
        this.message = message
    }
}

export default ApiResponse
