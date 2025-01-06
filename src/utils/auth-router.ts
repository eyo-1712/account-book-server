import { Router } from 'express'
import { authMiddleware } from '../middleware'

export const generateRouterWithAuthMiddleware = () => {
  return Router().use(authMiddleware)
}
