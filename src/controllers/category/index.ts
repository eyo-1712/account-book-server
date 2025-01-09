import { Category } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { ISuccessResponse } from '../../_type/json'
import { InvalidParamsError, InvalidSchemaError } from '../../config/app-error'
import { prisma } from '../../config/prisma'
import { TController } from '../type'
import { schema } from './schema'

export const categoryController: TController = {
  create: async (request: Request, response: Response, next: NextFunction) => {
    const uid = request.session.uid
    const body = request.body

    if (!Array.isArray(body)) return next(InvalidSchemaError)

    const data = body.map((b) => ({ ...b, uid }))

    const condition = data.filter((d) => !schema.safeParse(d)).length !== 0
    if (condition) return next(InvalidSchemaError)

    const categories = await prisma.category.createMany({ data })

    response.status(201).json({
      statusCode: 201,
      success: true,
      data: categories.count,
    } as ISuccessResponse<number>)
  },
  fetchAll: async (request: Request, response: Response) => {
    const uid = request.session.uid

    const categories: Category[] = await prisma.category.findMany({
      where: { uid },
    })

    response.status(200).json({
      statusCode: 200,
      success: true,
      data: categories,
    } as ISuccessResponse<Category[]>)
  },
  fetchId: async (request: Request, response: Response, next: NextFunction) => {
    const { params, session } = request
    const id = parseInt(params.id)
    const uid = session.uid

    if (isNaN(id)) return next(InvalidParamsError)

    const category: Category | null = await prisma.category.findUnique({
      where: { id, uid },
    })

    if (!category) return next(InvalidParamsError)

    response.status(200).json({
      statusCode: 200,
      success: true,
      data: category,
    } as ISuccessResponse<Category>)
  },
  modify: async (request: Request, response: Response, next: NextFunction) => {
    const body = request.body
    const id = parseInt(request.params.id)
    const uid = request.session.uid

    if (isNaN(id)) return next(InvalidParamsError)

    if (!body) return next(InvalidParamsError)

    const data = { ...body, uid }

    if (!schema.safeParse(data)) return next(InvalidSchemaError)

    const category: Category = await prisma.category.update({
      data,
      where: { id },
    })

    response.status(201).json({
      statusCode: 201,
      success: true,
      data: category,
    } as ISuccessResponse<Category>)
  },
  remove: async (request: Request, response: Response, next: NextFunction) => {
    const { params, session } = request
    const id = parseInt(params.id)
    const uid = session.uid

    if (isNaN(id)) return next(InvalidParamsError)

    const find = await prisma.category.findFirst({
      where: { id, uid },
    })

    if (!find) return next(InvalidParamsError)

    const data = await prisma.category.delete({
      where: { id, uid },
    })

    response.status(204).json({
      statusCode: 204,
      success: true,
      data,
    } as ISuccessResponse<Category>)
  },
}
