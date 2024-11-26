import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../utils/constants/http.js";
import { z } from "zod";
import { AppError } from "../utils/AppError.js";

const handleZodError = (res, error) => {
    const errors = error.issues.map(issue => ({
        path: issue.path.join(" "),
        message: issue.message
    }));
    return res.status(BAD_REQUEST).json({
        message: error.message,
        errors
    });
};

const handleAppError = (res, error) => {
    return res.status(error.statusCode).json({
        message: error.message,
        errorCode: error.errorCode
    });
};

const errorHandler = (error, req, res, next) => {
    console.log(`PATH: ${req.path}`, error);

    if (error instanceof z.ZodError) {
        return handleZodError(res, error);
    }
    if (error instanceof AppError) {
        return handleAppError(res, error);
    }
    res.status(INTERNAL_SERVER_ERROR).send("Internal Server Error. sometimes you forget to add .js to imports too so do check");
    // Do not return the Response object explicitly
};

export default errorHandler;
