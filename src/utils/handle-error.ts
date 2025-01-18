/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from 'express'
import { FailedResponse } from '../_type/json'
import { AppError } from '../config/app-error'

export const handleError = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const json: FailedResponse = {
    message: err.message,
    statusCode: err.statusCode,
    success: false,
  }
  res.status(err?.statusCode ?? 200).json(json)
}
