import { z } from "zod";

const errorHandler = (error, req, res, next) => {
    // Check if res is defined and has status method
    if (error instanceof z.ZodError) {
        const errors = error.issues.map(issue => ({
            path: issue.path.join(" "),
            message: issue.message
        }));

        return res.status(400).json({
            message: "Validation error", // Custom message for validation errors
            errors // Return detailed error path and message
        });
    }
    if (res && typeof res.status === 'function') {
        console.error(`Error at ${req.path}:`, error);

        return res.status(error.statusCode || 500).json({
            message: error.message || "Something went wrong!"
        });
    } else {
        console.error("Error: Invalid response object", error);
        next(error); // In case res is not available, pass the error to the default handler
    }
};

export default errorHandler