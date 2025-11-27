import ApiError from "../utils/API.error.js";

function notFound(req, res, next) {
    next(new ApiError(404, `Route ${req.originalUrl} not found`));
}

function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const payload = {
        success: false,
        message: err.message || 'Internal Server Error',
    };
    if (process.env.NODE_ENV !== 'production' && err.details) {
        payload.details = err.details;
    }
    return res.status(statusCode).json(payload);
}

export { notFound, errorHandler };