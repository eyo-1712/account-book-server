import { Router } from 'express'

export const authRouter = Router()

authRouter.route('/login').get()
