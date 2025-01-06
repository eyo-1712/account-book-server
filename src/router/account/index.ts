import { generateRouterWithAuthMiddleware } from '../../utils/auth-router'

export const accountRouter = generateRouterWithAuthMiddleware()

accountRouter
  .route('/')
  .get() //  all account info
  .post() // add  account

accountRouter
  .route('/:id')
  .get() //  detail account info
  .put() // modify account info
  .delete() // delete account

accountRouter.route('/transfer').post() // transfer account
