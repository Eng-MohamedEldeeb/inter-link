import { Router } from 'express'
import authModule from './auth/auth.module'

const router: Router = Router()

router.use('/auth', authModule)

export default router
