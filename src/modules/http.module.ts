import { Router } from 'express'
import { applyRateLimiter } from '../common/utils/security/rate-limiter/rate-limiter'
import { applyGuards } from '../common/decorators/guard/apply-guards.decorator'

import isAuthenticatedGuard from '../common/guards/auth/is-authenticated.guard'
import isAuthorizedGuard from '../common/guards/auth/is-authorized.guard'

import authModule from './auth/http/auth.module'
import notificationModule from './notification/http/notification.module'
import profileModule from './profile/http/profile.module'
import userModule from './user/http/user.module'
import storyModule from './story/http/story.module'
import postModule from './post/http/post.module'
import commentModule from './comment/http/comment.module'
import groupModule from './group/http/group.module'

const router: Router = Router()

router.use('/auth', applyRateLimiter(), authModule)

router.use(
  '/notification',
  applyRateLimiter({ skipSuccessfulRequests: true }),
  applyGuards(isAuthenticatedGuard, isAuthorizedGuard),
  notificationModule,
)

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
  '/story',
  applyRateLimiter({ skipSuccessfulRequests: false }),
  applyGuards(isAuthenticatedGuard, isAuthorizedGuard),
  storyModule,
)

router.use(
  '/post',
  applyRateLimiter({ skipSuccessfulRequests: false }),
  applyGuards(isAuthenticatedGuard, isAuthorizedGuard),
  postModule,
)

router.use(
  '/comment',
  applyRateLimiter({ skipSuccessfulRequests: false }),
  applyGuards(isAuthenticatedGuard, isAuthorizedGuard),
  commentModule,
)

router.use(
  '/group',
  applyRateLimiter({ skipSuccessfulRequests: false }),
  applyGuards(isAuthenticatedGuard, isAuthorizedGuard),
  groupModule,
)

export default router
