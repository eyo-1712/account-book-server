import { NextFunction, Request, Response } from 'express'
import { AuthError } from '../config/app-error'
import { prisma } from '../config/prisma'

export const authMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const uid = request.session?.uid
  if (!uid) return next(AuthError)

  // user 조회
  const find = await prisma.user.findFirst({ where: { uid } })
  if (!find) return next(AuthError)

  next('route')
}
