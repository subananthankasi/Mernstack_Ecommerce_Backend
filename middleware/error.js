
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            stack: err.stack,
            error: err
        });
    }

    if (process.env.NODE_ENV === 'production') {
        let message = err.message;
        let statusCode = err.statusCode;

        if (err.name === "ValidationError") {
            message = Object.values(err.errors).map(value => value.message).join(", ");
            statusCode = 400;
        }
        if (err.name === "CastError") {
            message = `Resource not found: ${err.path} `,
            statusCode = 400;

        }
        if (err.code === 11000) {
            message = `Dublicate ${Object.keys(err.keyValue)} error`
            statusCode = 400;

        }
        if (err.name === "JSONWebTokenError") {
            message = `JSON Web token is invalid.Try again!`
        }
        if (err.name === "TokenExpiredError") {
            message = `JSON Web token is expired.Try again!`
            statusCode = 400;
        }

        return res.status(statusCode).json({
            success: false,
            message: message || "Internal Server Error",
        });
    }
};
