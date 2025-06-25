import { Router } from 'express'
import { applyRateLimiter } from './common/decorators/rate-limiter.decorator'
import { applyGuardsActivator } from './common/decorators/apply-activators.decorator'
import isAuthenticatedGuard from './common/guards/is-authenticated.guard'
import isAuthorizedGuard from './common/guards/is-authorized.guard'

import authModule from './modules/auth/auth.module'
import userModule from './modules/profile/profile.module'
import profileModule from './modules/profile/profile.module'

const router: Router = Router()

router.use('/auth', applyRateLimiter(), authModule)

router.use(
  '/profile',
  applyRateLimiter({ skipSuccessfulRequests: true }),
  applyGuardsActivator(isAuthenticatedGuard, isAuthorizedGuard),
  profileModule,
)

router.use(
  '/user',
  applyRateLimiter({ skipSuccessfulRequests: true }),
  applyGuardsActivator(isAuthenticatedGuard, isAuthorizedGuard),
  userModule,
)

export default router
