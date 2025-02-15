import { Summary } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { SuccessResponse } from '../../_type/json'
import { InvalidParamsError, InvalidSchemaError } from '../../config/app-error'
import { prisma } from '../../config/prisma'
import { TController } from '../type'
import { schema } from './schema'

export const summaryControlller: TController = {
  create: async (request: Request, response: Response, next: NextFunction) => {
    const { body, session } = request
    const uid = session.uid

    const data = { ...body, uid }

    if (!schema.safeParse(data)) return next(InvalidSchemaError)

    const summary: Summary = await prisma.summary.create(data)

    response.status(201).json({
      statusCode: 201,
      success: true,
      data: summary,
    } as SuccessResponse<Summary>)
  },
  fetchMonth: async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const { query, session } = request
    const date = query?.date
    const uid = session.uid

    if (!date) return next(InvalidParamsError)
    if (typeof date !== 'string') return next(InvalidParamsError)
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(date)) return next(InvalidParamsError)

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
        deleted: false,
      },
    })

    response.status(200).json({
      statusCode: 200,
      success: true,
      data: summaries,
    } as SuccessResponse<Summary[]>)
  },
  fetchId: async (request: Request, response: Response, next: NextFunction) => {
    const { params, session } = request
    const uid = session.uid
    const id = parseInt(params.id)

    if (isNaN(id)) return next(InvalidParamsError)

    const summary: Summary | null = await prisma.summary.findFirst({
      where: { id, uid, deleted: false },
    })

    if (!summary) return next(InvalidParamsError)

    response.status(200).json({
      statusCode: 200,
      success: true,
      data: summary as Summary,
    } as SuccessResponse<Summary>)
  },
  modify: async (request: Request, response: Response, next: NextFunction) => {
    const { body, params, session } = request
    const id = parseInt(params.id)
    const uid = session.uid

    if (isNaN(id)) return next(InvalidParamsError)

    if (!schema.safeParse(body)) return next(InvalidSchemaError)

    const summary: Summary = await prisma.summary.update({
      data: body,
      where: { id, uid },
    })

    response.status(201).json({
      statusCode: 201,
      success: true,
      data: summary,
    } as SuccessResponse<Summary>)
  },
  remove: async (request: Request, response: Response, next: NextFunction) => {
    const { params, session } = request
    const id = parseInt(params.id)
    const uid = session.uid

    if (isNaN(id)) return next(InvalidParamsError)

    const summary = await prisma.summary.update({
      where: { id, uid },
      data: { deleted: true },
    })

    response.status(204).json({
      statusCode: 204,
      success: true,
      data: summary,
    })
  },
}
