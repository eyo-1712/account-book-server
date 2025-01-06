import { authMiddleware } from '../../middleware'
import { generateRouterWithAuthMiddleware } from '../../utils/auth-router'

export const analysisRouter = generateRouterWithAuthMiddleware()

analysisRouter.use(authMiddleware)

analysisRouter.route('/').get() // analysis info
