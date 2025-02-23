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

    const [summary] = await prisma.$transaction([
      prisma.summary.create({ data }),
      prisma.account.update({
        where: { id: body.accountId }, // body에 accountId가 있다고 가정
        data: {
          money:
            body.type === 'expenditure'
              ? { decrement: body.money }
              : { increment: body.money },
        },
      }),
    ])

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
    const take = 10
    const { params, query, session } = request
    const topic = params?.topic as string
    const topicId = query.topicId as string
    const uid = session.uid
    const lastId = query.lastId as string

    if (!['categoryId', 'accountId'].includes(topic)) {
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

    const lastSummary = lastId
      ? await prisma.summary.findUnique({ where: { id: lastId } })
      : null

    if (lastId && !lastSummary) {
      return next(InvalidParamsError)
    }

    const summaries: Summary[] = await prisma.summary.findMany({
      where: {
        uid,
        deleted: false,
        ...WHERE,
        ...(lastId
          ? {
              datetime: { lt: new Date(lastSummary!.datetime) },
              id: { not: lastSummary!.id },
            }
          : {}),
      },
      include: { category: true, account: true },
      orderBy: { datetime: 'desc' },
      take,
    })

    response.status(200).json({
      statusCode: 200,
      success: true,
      data: summaries,
      hasNext: summaries.length === take,
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
    const id = params.id

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

    const summary = await prisma
      .$transaction(async (prisma) => {
        const _summary = await prisma.summary.findUnique({
          where: { id, uid },
        })

        if (!_summary) {
          throw new Error('Summary not found')
        }

        // 이전과 새 값 비교
        const moneyDifference = body.money - _summary.money

        const updatedSummary = await prisma.summary.update({
          where: { id, uid },
          data: { ...body, datetime: new Date(body.datetime) },
        })

        await prisma.account.update({
          where: { id: updatedSummary.accountId },
          data: {
            money:
              moneyDifference > 0
                ? { increment: moneyDifference }
                : { decrement: Math.abs(moneyDifference) },
          },
        })

        return updatedSummary
      })
      .catch((err) => {
        return next(err) // 트랜잭션에서 에러가 나면 처리
      })

    response.status(201).json({
      statusCode: 201,
      success: true,
      data: summary,
    } as SuccessResponse<Summary>)
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  remove: async (request: Request, response: Response, next: NextFunction) => {
    const { params, session } = request
    const id = params.id
    const uid = session.uid

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
