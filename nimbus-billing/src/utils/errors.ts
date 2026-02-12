export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static badRequest(message: string): AppError {
    return new AppError(400, 'BAD_REQUEST', message);
  }

  static notFound(resource: string, id: string): AppError {
    return new AppError(404, 'NOT_FOUND', `${resource} with id '${id}' not found`);
  }

  static conflict(message: string): AppError {
    return new AppError(409, 'CONFLICT', message);
  }

  static internal(message = 'Internal server error'): AppError {
    return new AppError(500, 'INTERNAL_ERROR', message);
  }
}
