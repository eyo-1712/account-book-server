import { Router } from 'express'
import { accountRouter } from './account'
import { analysisRouter } from './analysis'
import { authRouter } from './auth'
import { categoryRouter } from './category'
import { summaryRouter } from './summary'

export const router = Router()

router.use('/account', accountRouter)
router.use('/analysis', analysisRouter)
router.use('/auth', authRouter)
router.use('/category', categoryRouter)
router.use('/summary', summaryRouter)
