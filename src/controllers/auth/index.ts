/* eslint-disable @typescript-eslint/no-unused-vars */

import { User } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { UserRecord } from 'firebase-admin/lib/auth/user-record'
import { ISuccessResponse } from '../../_type/json'
import {
  AuthError,
  InternalServerError,
  InvalidQueryError,
} from '../../config/app-error'
import { firebaseAdmin } from '../../config/firebase'
import { prisma } from '../../config/prisma'
import { TController } from '../type'

export const authController: TController = {
  google: async (req: Request, res: Response, next: NextFunction) => {
    const idToken = req.query?.idToken

    if (!idToken) return next(InvalidQueryError)

    let decodedToken
    try {
      decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken as string)
    } catch (error: unknown) {
      return next(InvalidQueryError)
    }

    let user: UserRecord
    try {
      user = await firebaseAdmin.auth().getUser(decodedToken?.uid ?? '')
      if (!user) throw AuthError
    } catch (error) {
      return next(error)
    }

    const uid = decodedToken?.uid
    if (!uid) return next(AuthError)

    try {
      let user = await prisma.user.findUnique({ where: { uid } })

      if (!user) {
        user = await prisma.user.create({ data: { uid } })
      }

      req.session.uid = user.uid

      res.status(200).json({
        statusCode: 200,
        success: true,
        data: user,
      } as ISuccessResponse<User>)
    } catch (error) {
      return next(InternalServerError)
    }
  },
  check: (req: Request, res: Response) => {
    req.session.uid = '123123'
    res
      .status(200)
      .cookie('account-book-knsn-uid', req.session.uid)
      .json({ uid: req.session.uid })
  },
}
