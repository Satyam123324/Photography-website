const notFound = (req, res, next) => { const e = new Error(`Not Found - ${req.originalUrl}`); res.status(404); next(e); };
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  if (err.name === "CastError") { statusCode = 404; message = "Resource not found"; }
  if (err.code === 11000) { statusCode = 400; message = `Duplicate value for ${Object.keys(err.keyValue)}`; }
  if (err.name === "ValidationError") { statusCode = 400; message = Object.values(err.errors).map(v => v.message).join(", "); }
  res.status(statusCode).json({ success: false, message });
};
module.exports = { notFound, errorHandler };
