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
  fetchMonth: (request: Request, response: Response) => {},
  fetchDate: async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {},
  modify: async (request: Request, response: Response, next: NextFunction) => {
    const { body, params } = request

    if (!params?.id) return next(new AppError(400, 'invalid schema'))

    if (!schema.safeParse(body)) {
      return next(new AppError(400, 'invalid schema'))
    }

    const summary: Summary = await prisma.summary.update({
      data: body,
      where: { id: body.id },
    })

    response.status(201).json({
      statusCode: 201,
      success: true,
      data: summary,
    } as ISuccessResponse<Summary>)
  },
  remove: async (request: Request, response: Response, next: NextFunction) => {
    const { params } = request

    if (!params.id) return next(new AppError(400, 'invalid id'))

    const id = parseInt(params.id)
    if (isNaN(id)) return next(new AppError(400, 'invalid id'))

    const summary = await prisma.summary.delete({ where: { id } })

    response.status(204).json({
      statusCode: 204,
      success: true,
      data: summary,
    })
  },
}
