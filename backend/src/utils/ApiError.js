
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.success = false;
    this.data = null;
    this.errors = errors.length ? errors : undefined;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError ;