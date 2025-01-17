import { NextFunction, Request, Response } from 'express'
import { AuthError } from '../config/app-error'
import { UID_KEY } from '../config/cookie'
import { redisClient } from '../config/redis'

export const authMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const uidKey = request.signedCookies[UID_KEY]
  if (!uidKey) return next(AuthError)

  const find = await redisClient.get(`s:${uidKey}`)
  if (!find) return next(AuthError)

  next('route')
}
