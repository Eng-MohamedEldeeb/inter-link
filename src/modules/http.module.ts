import { Router } from "express"
import { applyRateLimiter } from "../common/utils/security/rate-limiter/rate-limiter"
import { applyGuards } from "../common/decorators/guard/apply-guards.decorator"

import { isAuthenticatedGuard, isAuthorizedGuard } from "../common/guards"
import authModule from "./auth/http/auth.module"
import profileModule from "./profile/http/profile.module"
import userModule from "./user/http/user.module"
import storyModule from "./story/http/story.module"
import postModule from "./post/http/post.module"
import commentModule from "./comment/http/comment.module"
import communityModule from "./community/http/community.module"
import notificationModule from "./notification/http/notification.module"
import chatModule from "./chat/http/chat.module"
import groupModule from "./group/http/group.module"

const router: Router = Router()

router.use("/auth", applyRateLimiter(), authModule)

router.use(
  "/profile",
  applyRateLimiter({ skipSuccessfulRequests: true }),
  applyGuards(isAuthenticatedGuard, isAuthorizedGuard),
  profileModule,
)

router.use(
  "/user",
  applyRateLimiter({ skipSuccessfulRequests: true }),
  applyGuards(isAuthenticatedGuard, isAuthorizedGuard),
  userModule,
)

router.use(
  "/story",
  applyRateLimiter({ skipSuccessfulRequests: false }),
  applyGuards(isAuthenticatedGuard, isAuthorizedGuard),
  storyModule,
)

router.use(
  "/post",
  applyRateLimiter({ skipSuccessfulRequests: false }),
  applyGuards(isAuthenticatedGuard, isAuthorizedGuard),
  postModule,
)

router.use(
  "/comment",
  applyRateLimiter({ skipSuccessfulRequests: false }),
  applyGuards(isAuthenticatedGuard, isAuthorizedGuard),
  commentModule,
)

router.use(
  "/community",
  applyRateLimiter({ skipSuccessfulRequests: false }),
  applyGuards(isAuthenticatedGuard, isAuthorizedGuard),
  communityModule,
)

router.use(
  "/notification",
  applyRateLimiter({ skipSuccessfulRequests: true }),
  applyGuards(isAuthenticatedGuard, isAuthorizedGuard),
  notificationModule,
)

router.use(
  "/chat",
  applyRateLimiter({ skipSuccessfulRequests: false }),
  applyGuards(isAuthenticatedGuard, isAuthorizedGuard),
  chatModule,
)

router.use(
  "/groups",
  applyRateLimiter({ skipSuccessfulRequests: false }),
  applyGuards(isAuthenticatedGuard, isAuthorizedGuard),
  groupModule,
)

export default router
