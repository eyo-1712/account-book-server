import { Router } from 'express'
import { authController } from '../../controllers/auth'
import { authMiddleware } from '../../middleware'

export const authRouter = Router()

authRouter.route('/google').get(authController.google)

authRouter.use(authMiddleware).route('/info').get(authController.info)
