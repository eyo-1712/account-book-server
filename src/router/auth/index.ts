import { Router } from 'express'
import { authController } from '../../controllers/auth'

export const authRouter = Router()

authRouter.route('/google').get(authController.google)
authRouter.route('/check').get(authController.check)
