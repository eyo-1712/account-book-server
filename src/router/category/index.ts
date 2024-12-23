import { Router } from 'express'

export const categoryRouter = Router()

categoryRouter
  .route('/')
  .get() // all category
  .post() // create category

categoryRouter
  .route('/:id')
  .get() // detail category info
  .put() // modify category info
  .delete() // remove category
