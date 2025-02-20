import { summaryControlller } from '../../controllers/summary'
import { generateRouterWithAuthMiddleware } from '../../utils/auth-router'

export const summaryRouter = generateRouterWithAuthMiddleware()

summaryRouter
  .route('/')
  .get(summaryControlller.fetchMonth) // query year, query month
  .post(summaryControlller.create) // create summary
  .put(summaryControlller.modify) // modify summary

summaryRouter.route(`/topic`).get(summaryControlller.fetchTopic)

summaryRouter
  .route('/:id')
  .get(summaryControlller.fetchId) // summary detail info
  .delete(summaryControlller.remove) // delete summary
