import { Router } from 'express'

export const summaryRouter = Router()

summaryRouter
  .route('/')
  .get() // query year, query month
  .post() // create summary
summaryRouter
  .route('/:id')
  .get() // summary detail info
  .put() // modify summary
  .delete() // delete summary
