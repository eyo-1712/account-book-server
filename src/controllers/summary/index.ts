/* eslint-disable @typescript-eslint/no-unused-vars */
import { Summary } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { ISuccessResponse } from '../../_type/json'
import { AppError } from '../../config/app-error'
import { prisma } from '../../config/prisma'
import { TController } from '../type'
import { schema } from './schema'

export const summaryControlller: TController = {
  create: async (request: Request, response: Response, next: NextFunction) => {
    const { body } = request

    if (!schema.safeParse(body)) {
      return next(new AppError(400, 'invalid schema'))
    }

    const summary: Summary = await prisma.summary.create(body)

    response.status(201).json({
      statusCode: 201,
      success: true,
      data: summary,
    } as ISuccessResponse<Summary>)
  },
  fetchMonth: (request: Request, response: Response) => {
    //
  },
  fetchDate: (request: Request, response: Response) => {
    //
  },
  modify: (request: Request, response: Response) => {},
  remove: (request: Request, response: Response) => {
    //
  },
}
