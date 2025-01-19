import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors.length > 0 ? err.errors : undefined,
            data: err.data,
        });
    }

    // Log unexpected errors for debugging
    console.error("Unhandled Error:", err.stack || err);

    // Return generic error response for unhandled exceptions
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};
export default errorHandler;
