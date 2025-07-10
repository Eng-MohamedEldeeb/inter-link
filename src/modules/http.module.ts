import { Router } from 'express'

import authModule from './auth/http/auth.module'
import profileModule from './profile/http/profile.module'
import userModule from './user/http/user.module'
import postModule from './post/http/post.module'
import commentModule from './comment/http/comment.module'

import { applyRateLimiter } from '../common/utils/security/rate-limiter/rate-limiter'

import { applyGuards } from '../common/decorators/guard/apply-guards.decorator'
import isAuthenticatedGuard from '../common/guards/auth/is-authenticated.guard'
import isAuthorizedGuard from '../common/guards/auth/is-authorized.guard'
import postExistenceGuard from '../common/guards/post/post-existence.guard'

import { validate } from '../common/middlewares/validation/validation.middleware'
import { getPostCommentsValidator } from './comment/validators/comment.validators'

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
  applyRateLimiter({ skipSuccessfulRequests: false }),
  applyGuards(isAuthenticatedGuard, isAuthorizedGuard),
  postModule,
)

router.use(
  '/:postId/comments',
  applyRateLimiter({ skipSuccessfulRequests: false }),
  applyGuards(isAuthenticatedGuard, isAuthorizedGuard, postExistenceGuard),
  commentModule,
)
export default router
