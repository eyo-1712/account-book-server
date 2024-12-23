import { Router } from 'express'

export const analysisRouter = Router()

analysisRouter.route('/').get() // analysis info
