import { Router } from 'express'

import authModule from './auth/http/auth.module'
import profileModule from './profile/http/profile.module'
import userModule from './user/http/user.module'
import postModule from './post/http/post.module'

import { applyRateLimiter } from '../common/utils/security/rate-limiter/rate-limiter'

import { applyGuards } from '../common/decorators/guard/apply-guards.decorator'
import isAuthenticatedGuard from '../common/guards/is-authenticated.guard'
import isAuthorizedGuard from '../common/guards/is-authorized.guard'

const router: Router = Router()

router.use('/auth', applyRateLimiter(), authModule)

router.use(
  '/profile',
  applyRateLimiter({ skipSuccessfulRequests: true }),
  applyGuards(isAuthenticatedGuard, isAuthorizedGuard),
  profileModule,
)

router.use(
  '/user',
  applyRateLimiter({ skipSuccessfulRequests: true }),
  applyGuards(isAuthenticatedGuard, isAuthorizedGuard),
  userModule,
)

router.use(
  '/post',
  applyRateLimiter({ skipSuccessfulRequests: true }),
  applyGuards(isAuthenticatedGuard, isAuthorizedGuard),
  postModule,
)
export default router
