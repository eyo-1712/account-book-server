import { accountController } from '../../controllers/account'
import { generateRouterWithAuthMiddleware } from '../../utils/auth-router'

export const accountRouter = generateRouterWithAuthMiddleware()

accountRouter
  .route('/')
  .get(accountController.fetchAll) // all account info
  .post(accountController.create) // add account
  .patch(accountController.modify) // modify account info

accountRouter
  .route('/:id')
  .get(accountController.fetchId) //  detail account info
  .delete(accountController.remove) // delete account

accountRouter.route('/transfer').post(accountController.transfer) // transfer account
