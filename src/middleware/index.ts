import { NextFunction, Request, Response } from 'express'
import { AppError } from '../config/app-error'
import { prisma } from '../config/prisma'

export const authMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const uid = request.session?.uid
  if (!uid) return next(new AppError(401, 'Unauthorization'))

  // user 조회
  const find = await prisma.user.findFirst({ where: { uid } })
  if (!find) return next(new AppError(401, 'Unauthorization'))

  next('route')
}
