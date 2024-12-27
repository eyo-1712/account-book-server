/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from 'express'
import { AppError } from '../../config/app-error'
import { firebaseAdmin } from '../../config/firebase'
import { TController } from '../type'

export const authController: TController = {
  google: async (req: Request, res: Response, next: NextFunction) => {
    const idToken = req.query?.idToken

    if (!idToken) {
      next(new AppError(400, 'idToken is required'))
    }

    let decodedToken
    try {
      decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken as string)
    } catch (error: unknown) {
      next(new AppError(401, 'idToken is not verified'))
    }

    let user
    try {
      user = await firebaseAdmin.auth().getUser(decodedToken?.uid ?? '')
    } catch (error) {
      next(new AppError(401, 'Authentication failed'))
    }

    try {
      // 저장 시도
    } catch (error) {
      // 이미 있는
    }
  },
}
