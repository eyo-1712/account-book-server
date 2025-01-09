class AppError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)

    this.statusCode = statusCode
    Error.captureStackTrace(this)
  }
}

export const InvalidSchemaError = new AppError(400, 'Invalid Schema')
export const InvalidParamsError = new AppError(400, 'Invalid Params')
export const InvalidQueryError = new AppError(400, 'Invalid Query')
export const AuthError = new AppError(401, 'Authenticaiton Error')
export const InternalServerError = new AppError(500, 'Internal Server Error')
