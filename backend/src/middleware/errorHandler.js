export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    data: {},
    message: error.message || "Unexpected server error"
  });
}
