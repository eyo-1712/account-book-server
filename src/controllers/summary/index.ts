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

    const data = { ...body, uid, datetime: new Date(body.datetime) }

    if (!schema.safeParse(data)) return next(InvalidSchemaError)

    const summary: Summary = await prisma.summary.create({ data })

    response.status(201).json({
      statusCode: 201,
      success: true,
      data: summary,
    } as SuccessResponse<Summary>)
  },
  fetchTopic: async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const { params, query, session } = request
    const topic = params?.topic as string
    const topicId = parseInt(query.topicId as string, 10)
    const uid = session.uid
    const lastId = parseInt(query.lastId as string, 10)

    if (isNaN(topicId)) {
      return next(InvalidParamsError)
    }

    if (['categoryId', 'accountId'].includes(topic)) {
      return next(InvalidParamsError)
    }

    const WHERE = (() => {
      switch (topic) {
        case 'categoryId':
          return { categoryId: topicId }
        case 'accountId':
          return { accountId: topicId }
      }
    })()

    const summaries: Summary[] = await prisma.summary.findMany({
      where: {
        uid,
        deleted: false,
        ...WHERE,
        ...(lastId ? { id: { lt: lastId } } : {}),
      },
      include: { category: true, account: true },
      orderBy: { datetime: 'desc' },
      take: 10,
    })

    response.status(200).json({
      statusCode: 200,
      success: true,
      data: summaries,
    } as SuccessResponse<Summary[]>)
  },
  fetchMonth: async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const { query, session } = request
    const year = query?.year
    const month = `${query?.month}`.padStart(2, '0')
    const uid = session.uid

    if (!year || !month) return next(InvalidParamsError)
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(`${year}-${month}`)) {
      return next(InvalidParamsError)
    }

    const lt = new Date(
      parseInt(year as string, 10),
      parseInt(month as string, 10),
      1,
    )
    const gte = new Date(
      parseInt(year as string, 10),
      parseInt(month as string, 10) - 1,
      1,
    )
    const summaries: Summary[] = await prisma.summary.findMany({
      where: { uid, datetime: { gte, lt }, deleted: false },
      include: { category: true, account: true },
      orderBy: { datetime: 'desc' },
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
      include: { category: true, account: true },
    })

    if (!summary) return next(InvalidParamsError)

    response.status(200).json({
      statusCode: 200,
      success: true,
      data: summary as Summary,
    } as SuccessResponse<Summary>)
  },
  modify: async (request: Request, response: Response, next: NextFunction) => {
    const { body, session } = request
    const id = body.id
    const uid = session.uid

    if (isNaN(id)) return next(InvalidParamsError)

    if (!schema.safeParse(body)) return next(InvalidSchemaError)

    const summary: Summary = await prisma.summary.update({
      data: { ...body, datetime: new Date(body.datetime) },
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
