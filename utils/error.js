
class createError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.status = statusCode;
        this.statusText = `${statusCode}`.startsWith(4) ? "fail" : 'error'
    }
}


export default createError;