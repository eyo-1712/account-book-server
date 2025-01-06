import { generateRouterWithAuthMiddleware } from '../../utils/auth-router'

export const categoryRouter = generateRouterWithAuthMiddleware()

categoryRouter
  .route('/')
  .get() // all category
  .post() // create category

categoryRouter
  .route('/:id')
  .get() // detail category info
  .put() // modify category info
  .delete() // remove category
