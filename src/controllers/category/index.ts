/* eslint-disable @typescript-eslint/no-explicit-any */
import { Category } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { SuccessResponse } from '../../_type/json'
import { InvalidParamsError, InvalidSchemaError } from '../../config/app-error'
import { prisma } from '../../config/prisma'
import { TController } from '../type'
import { createSchema, modifySchema } from './schema'

export const categoryController: TController = {
  create: async (request: Request, response: Response, next: NextFunction) => {
    const { body, session } = request
    const uid = session.uid

    const _category: Category[] = await prisma.category.findMany({
      where: { uid, deleted: false },
    })
    const lastSort = _category.at(-1)?.sort ?? 0

    const data: Category[] = body.categories.map(
      ({ name }: { name: string }, i: number) => ({
        uid,
        name,
        sort: lastSort + i + 1,
      }),
    )

    const condition = createSchema.safeParse({ categories: data }).success
    if (!condition) return next(InvalidSchemaError)

    const categories = await prisma.category.createMany({ data })

    response.status(201).json({
      statusCode: 201,
      success: true,
      data: categories.count,
    } as SuccessResponse<number>)
  },
  fetchAll: async (request: Request, response: Response) => {
    const uid = request.session.uid

    const categories: Category[] = await prisma.category.findMany({
      where: { uid, deleted: false },
    })

    response.status(200).json({
      statusCode: 200,
      success: true,
      data: categories,
    } as SuccessResponse<Category[]>)
  },
  fetchId: async (request: Request, response: Response, next: NextFunction) => {
    const { params, session } = request
    const id = parseInt(params.id)
    const uid = session.uid

    if (isNaN(id)) return next(InvalidParamsError)

    const category: Category | null = await prisma.category.findUnique({
      where: { id, uid, deleted: false },
    })

    if (!category) return next(InvalidParamsError)

    response.status(200).json({
      statusCode: 200,
      success: true,
      data: category,
    } as SuccessResponse<Category>)
  },
  modify: async (request: Request, response: Response, next: NextFunction) => {
    const body = request.body
    const uid = request.session.uid

    if (!body) return next(InvalidParamsError)

    if (!modifySchema.safeParse(body)) return next(InvalidSchemaError)

    const category: Category = await prisma.category.update({
      data: { name: body.name },
      where: { id: body.id, uid },
    })

    response.status(201).json({
      statusCode: 201,
      success: true,
      data: category,
    } as SuccessResponse<Category>)
  },
  remove: async (request: Request, response: Response, next: NextFunction) => {
    const { params, session } = request
    const id = parseInt(params.id)
    const uid = session.uid

    if (isNaN(id)) return next(InvalidParamsError)

    const find = await prisma.category.findFirst({
      where: { id, uid, deleted: false },
    })

    if (!find) return next(InvalidParamsError)

    const data = await prisma.category.update({
      where: { id, uid },
      data: { deleted: true },
    })

    response.status(204).json({
      statusCode: 204,
      success: true,
      data,
    } as SuccessResponse<Category>)
  },
}
