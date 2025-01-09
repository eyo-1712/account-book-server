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
    const { body, session } = request
    const uid = session.uid

    const data = { ...body, uid }

    if (!schema.safeParse(data)) {
      return next(new AppError(400, 'Invalid schema'))
    }

    const summary: Summary = await prisma.summary.create(data)

    response.status(201).json({
      statusCode: 201,
      success: true,
      data: summary,
    } as ISuccessResponse<Summary>)
  },
  fetchMonth: async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const { query, session } = request
    const date = query?.date
    const uid = session.uid

    if (!date) {
      return next(new AppError(400, 'Invalid Date'))
    }
    if (typeof date !== 'string') {
      return next(new AppError(400, 'Invalid Date'))
    }
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(date)) {
      return next(new AppError(400, 'Invalid Date'))
    }

    const [year, month] = date.split('-')

    const summaries: Summary[] = await prisma.summary.findMany({
      where: {
        uid,
        createdAt: {
          gte: new Date(`${year}-${month}-01`),
          lt: new Date(
            `${year}-${String(Number(month) + 1).padStart(2, '0')}-01`,
          ),
        },
      },
    })

    response.status(200).json({
      statusCode: 200,
      success: true,
      data: summaries,
    } as ISuccessResponse<Summary[]>)
  },
  fetchId: async (request: Request, response: Response, next: NextFunction) => {
    const { params, session } = request
    const uid = session.uid
    const id = parseInt(params.id)

    if (isNaN(id)) return next(new AppError(400, 'Invalid Id'))

    const summary: Summary | null = await prisma.summary.findFirst({
      where: { id, uid },
    })

    if (!summary) return next(new AppError(404, 'Not Found'))

    response.status(200).json({
      statusCode: 200,
      success: true,
      data: summary as Summary,
    } as ISuccessResponse<Summary>)
  },
  modify: async (request: Request, response: Response, next: NextFunction) => {
    const { body, params, session } = request
    const id = parseInt(params.id)
    const uid = session.uid

    if (isNaN(id)) return next(new AppError(400, 'Invalid schema'))

    if (!schema.safeParse(body)) {
      return next(new AppError(400, 'Invalid schema'))
    }

    const summary: Summary = await prisma.summary.update({
      data: body,
      where: { id, uid },
    })

    response.status(201).json({
      statusCode: 201,
      success: true,
      data: summary,
    } as ISuccessResponse<Summary>)
  },
  remove: async (request: Request, response: Response, next: NextFunction) => {
    const { params, session } = request
    const id = parseInt(params.id)
    const uid = session.uid

    if (isNaN(id)) return next(new AppError(400, 'Invalid ID'))

    const summary = await prisma.summary.delete({ where: { id, uid } })

    response.status(204).json({
      statusCode: 204,
      success: true,
      data: summary,
    })
  },
}
