import { Router } from "express"
import { applyRateLimiter } from "../../common/utils/security/rate-limiter/rate-limiter"
import { applyGuards } from "../../common/decorators/guard/apply-guards.decorator"
import { routeLogger } from "../../common/utils/loggers/routes-logger"

import { isAuthenticatedGuard, isAuthorizedGuard } from "../../common/guards"

import authModule from "./auth/http/auth.module"
import profileModule from "./profile/http/profile.module"
import userModule from "./user/http/user.module"
import storyModule from "./story/http/story.module"
import postModule from "./post/http/post.module"
import commentModule from "./comment/http/comment.module"
import communityModule from "./community/http/community.module"
import notificationModule from "./notification/http/notification.module"
import chatModule from "./chat/http/chat.module"

const router: Router = Router()

router.use("/auth", applyRateLimiter(), authModule)
routeLogger({ routeName: "/auth", router: authModule })

router.use(
  "/profile",
  applyRateLimiter({ skipSuccessfulRequests: true }),
  applyGuards(isAuthenticatedGuard, isAuthorizedGuard),
  profileModule,
)
routeLogger({ routeName: "/profile", router: profileModule })

router.use(
  "/users",
  applyRateLimiter({ skipSuccessfulRequests: true }),
  applyGuards(isAuthenticatedGuard, isAuthorizedGuard),
  userModule,
)
routeLogger({ routeName: "/users", router: userModule })

router.use(
  "/stories",
  applyRateLimiter({ skipSuccessfulRequests: false }),
  applyGuards(isAuthenticatedGuard, isAuthorizedGuard),
  storyModule,
)
routeLogger({ routeName: "/stories", router: storyModule })

router.use(
  "/posts",
  applyRateLimiter({ skipSuccessfulRequests: false }),
  applyGuards(isAuthenticatedGuard, isAuthorizedGuard),
  postModule,
)
routeLogger({ routeName: "/posts", router: postModule })

router.use(
  "/comments",
  applyRateLimiter({ skipSuccessfulRequests: false }),
  applyGuards(isAuthenticatedGuard, isAuthorizedGuard),
  commentModule,
)
routeLogger({ routeName: "/comments", router: commentModule })

router.use(
  "/communities",
  applyRateLimiter({ skipSuccessfulRequests: false }),
  applyGuards(isAuthenticatedGuard, isAuthorizedGuard),
  communityModule,
)
routeLogger({ routeName: "/communities", router: communityModule })

router.use(
  "/notifications",
  applyRateLimiter({ skipSuccessfulRequests: true }),
  applyGuards(isAuthenticatedGuard, isAuthorizedGuard),
  notificationModule,
)
routeLogger({ routeName: "/notifications", router: notificationModule })

router.use(
  "/chats",
  applyRateLimiter({ skipSuccessfulRequests: false }),
  applyGuards(isAuthenticatedGuard, isAuthorizedGuard),
  chatModule,
)
routeLogger({ routeName: "/chats", router: chatModule })

export default router
