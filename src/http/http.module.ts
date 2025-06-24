import { Router } from 'express'
import authModule from './modules/auth/auth.module'

const router: Router = Router()

router.use('/auth', authModule)

export default router
