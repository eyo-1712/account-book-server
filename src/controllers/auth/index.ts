/* eslint-disable @typescript-eslint/no-unused-vars */

import { User } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { UserRecord } from 'firebase-admin/lib/auth/user-record'
import { ISuccessResponse } from '../../_type/json'
import { AppError } from '../../config/app-error'
import { firebaseAdmin } from '../../config/firebase'
import { prisma } from '../../config/prisma'
import { TController } from '../type'

export const authController: TController = {
  google: async (req: Request, res: Response, next: NextFunction) => {
    const idToken = req.query?.idToken

    if (!idToken) {
      return next(new AppError(400, 'idToken is required'))
    }

    let decodedToken
    try {
      decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken as string)
    } catch (error: unknown) {
      return next(new AppError(401, 'idToken is not verified'))
    }

    let user: UserRecord
    try {
      user = await firebaseAdmin.auth().getUser(decodedToken?.uid ?? '')
      if (!user) {
        throw ''
      }
    } catch (error) {
      return next(new AppError(401, 'Authentication failed'))
    }

    const uid = decodedToken?.uid
    if (!uid) {
      return next(new AppError(401, 'Invalid token payload'))
    }

    try {
      let user = await prisma.user.findUnique({ where: { uid } })

      if (!user) {
        user = await prisma.user.create({ data: { uid } })
      }

      // Return user data
      return res.status(200).json({
        statusCode: 200,
        success: true,
        data: user,
      } as ISuccessResponse<User>)
    } catch (error) {
      return next(new AppError(500, 'An unexpected error occurred'))
    }
  },
}
