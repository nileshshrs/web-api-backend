class AppError extends Error {
    constructor(statusCode, message, errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errorCode = errorCode;
    }
}

const AppErrorCode = {
    InvalidAccessToken: "InvalidAccessToken"
};

export { AppError, AppErrorCode };
