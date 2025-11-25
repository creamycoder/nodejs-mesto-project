import STATUS from '../utils/constants';

export interface IError extends Error {
  statusCode?: number;
}

class CustomError extends Error implements IError {
  public statusCode: number;

  constructor(status: number, message: string) {
    super(message);
    this.statusCode = status;
  }

  static BadRequest(message: string) {
    return new CustomError(STATUS.BAD_REQUEST, message);
  }

  static Unauthorized(message: string) {
    return new CustomError(STATUS.UNAUTHORIZED, message);
  }

  static NotFound(message: string) {
    return new CustomError(STATUS.NOT_FOUND, message);
  }

  static Forbidden(message: string) {
    return new CustomError(STATUS.FORBIDDEN, message);
  }

  static Conflict(message: string) {
    return new CustomError(STATUS.CONFLICT, message);
  }
}

module.exports = CustomError;