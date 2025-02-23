import { categoryController } from '../../controllers/category'
import { generateRouterWithAuthMiddleware } from '../../utils/auth-router'

export const categoryRouter = generateRouterWithAuthMiddleware()

categoryRouter
  .route('/')
  .get(categoryController.fetchAll) // all category
  .post(categoryController.create) // create category
  .patch(categoryController.modify) // modify category info

categoryRouter
  .route('/:id')
  .get(categoryController.fetchId) // detail category info
  .delete(categoryController.remove) // remove category
