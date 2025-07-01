import { Router } from 'express'

import authModule from './modules/auth/auth.module'
import profileModule from './modules/profile/profile.module'
import userModule from './modules/user/user.module'
import postModule from './modules/post/post.module'

import { applyRateLimiter } from '../common/decorators/http/rate-limiter.decorator'
import { applyGuardsActivator } from '../common/decorators/apply-guards-activator.decorator'
import isAuthenticatedGuard from '../common/guards/is-authenticated.guard'
import isAuthorizedGuard from '../common/guards/is-authorized.guard'

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

router.use(
  '/post',
  applyRateLimiter({ skipSuccessfulRequests: true }),
  applyGuardsActivator(isAuthenticatedGuard, isAuthorizedGuard),
  postModule,
)
export default router
