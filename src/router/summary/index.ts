import { summaryControlller } from '../../controllers/summary'
import { generateRouterWithAuthMiddleware } from '../../utils/auth-router'

export const summaryRouter = generateRouterWithAuthMiddleware()

summaryRouter
  .route('/')
  .get(summaryControlller.fetchAll) // query year, query month
  .post(summaryControlller.create) // create summary
summaryRouter
  .route('/:id')
  .get(summaryControlller.fetchId) // summary detail info
  .put(summaryControlller.modify) // modify summary
  .delete(summaryControlller.remove) // delete summary
