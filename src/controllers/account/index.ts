import { Account } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { ISuccessResponse } from '../../_type/json'
import { InvalidParamsError, InvalidSchemaError } from '../../config/app-error'
import { prisma } from '../../config/prisma'
import { TController } from '../type'
import { schema, transferSchema } from './schema'

export const accountController: TController = {
  create: async (request: Request, response: Response, next: NextFunction) => {
    const { body, session } = request
    const uid = session.uid

    const validation = !schema.safeParse({ ...body, uid }).success

    if (!validation) return next(InvalidSchemaError)

    const data = await prisma.account.create({ ...body, uid })

    response.status(201).json({
      success: true,
      statusCode: 201,
      data,
    } as ISuccessResponse<Account>)
  },
  fetchAll: async (request: Request, response: Response) => {
    const uid = request.session.uid

    const accounts = await prisma.account.findMany({
      where: { uid, deleted: false },
    })

    response.status(200).json({
      data: accounts,
      statusCode: 200,
      success: true,
    } as ISuccessResponse<Account[]>)
  },
  fetchId: async (request: Request, response: Response, next: NextFunction) => {
    const { params, session } = request
    const id = parseInt(params.id)
    const uid = session.uid

    if (isNaN(id)) return next(InvalidParamsError)

    const account: Account | null = await prisma.account.findUnique({
      where: { id, uid, deleted: false },
    })

    if (!account) return next(InvalidParamsError)

    response.status(200).json({
      statusCode: 200,
      success: true,
      data: account,
    } as ISuccessResponse<Account>)
  },
  modify: async (request: Request, response: Response, next: NextFunction) => {
    const body = request.body
    const id = parseInt(request.params.id)
    const uid = request.session.uid

    if (isNaN(id)) return next(InvalidParamsError)

    if (!body) return next(InvalidParamsError)

    const data = { ...body, uid }

    if (!schema.safeParse(data)) return next(InvalidSchemaError)

    const account: Account = await prisma.account.update({
      data,
      where: { id },
    })

    response.status(201).json({
      statusCode: 201,
      success: true,
      data: account,
    } as ISuccessResponse<Account>)
  },
  remove: async (request: Request, response: Response, next: NextFunction) => {
    const { params, session } = request
    const id = parseInt(params.id)
    const uid = session.uid

    if (isNaN(id)) return next(InvalidParamsError)

    const find = await prisma.category.findFirst({ where: { id, uid } })

    if (!find) return next(InvalidParamsError)

    const data = await prisma.account.update({
      where: { id, uid },
      data: { deleted: true },
    })

    response.status(204).json({
      statusCode: 204,
      success: true,
      data,
    } as ISuccessResponse<Account>)
  },
  // 송금
  transfer: async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const { body, session } = request
    const uid = session.uid

    if (!transferSchema.safeParse(body).success) return next(InvalidSchemaError)

    const [giveAccount, takeAccount] = await Promise.all([
      prisma.account.findUnique({
        where: { id: body.giveId, uid, deleted: false },
      }),
      prisma.account.findUnique({
        where: { id: body.takeId, uid, deleted: false },
      }),
    ])

    if (!giveAccount || !takeAccount) return next(InvalidSchemaError)
    if (giveAccount.money < body.money) return next(InvalidSchemaError)

    const data = await Promise.all([
      prisma.account.update({
        where: { uid, id: body.giveId },
        data: { money: { decrement: body.money } },
      }),
      prisma.account.update({
        where: { uid, id: body.takeId },
        data: { money: { increment: body.money } },
      }),
    ])

    response.status(201).json({
      data,
      statusCode: 201,
      success: true,
    } as ISuccessResponse<Account[]>)
  },
}
