const errorHandler = (err, req, res, next) => {
    console.error("Error caught:", err);

    const statusCode = err.status || 500;
    res.status(statusCode).json({
        status: err.statusText || "error",
        message: err.message || "Internal Server Error",
    });
};

export default errorHandler;  