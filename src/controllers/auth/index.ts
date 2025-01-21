/* eslint-disable @typescript-eslint/no-unused-vars */

import { User } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { UserRecord } from 'firebase-admin/lib/auth/user-record'
import { SuccessResponse } from '../../_type/json'
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
      } as SuccessResponse<User>)
    } catch (error) {
      return next(InternalServerError)
    }
  },
  info: async (request: Request, response: Response, next: NextFunction) => {
    const { session } = request
    const uid = session.uid

    const info = await prisma.user.findUnique({ where: { uid } })
    if (!info) return next(AuthError)

    response.status(200).json({
      success: true,
      statusCode: 200,
      data: info,
    } as SuccessResponse<User>)
  },
}
