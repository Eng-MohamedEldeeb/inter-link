import { Router } from "express"
import { validate } from "../../../common/middlewares/validation/validation.middleware"
import { applyGuards } from "../../../common/decorators/guard/apply-guards.decorator"

import * as validators from "../validator/user.validator"

import userController from "./user.controller"
import UserExistenceGuard from "../../../common/guards/user/user-existence.guard"
import isBlockedUserGuard from "../../../common/guards/user/is-blocked-user.guard"
import userPrivacyGuard from "../../../common/guards/user/user-privacy.guard"

const router: Router = Router()

router.get(
  "/",
  validate(validators.getUserProfileSchema.http()),
  applyGuards(UserExistenceGuard, isBlockedUserGuard, userPrivacyGuard),
  userController.getUserProfile,
)

router.get(
  "/following",
  validate(validators.getUserProfileSchema.http()),
  applyGuards(UserExistenceGuard, isBlockedUserGuard, userPrivacyGuard),
  userController.getUserFollowing,
)

router.get(
  "/followers",
  validate(validators.getUserProfileSchema.http()),
  applyGuards(UserExistenceGuard, isBlockedUserGuard, userPrivacyGuard),
  userController.getUserFollowers,
)

router.post(
  "/block",
  validate(validators.blockUserSchema.http()),
  applyGuards(UserExistenceGuard, isBlockedUserGuard),
  userController.block,
)

router.patch(
  "/un-block",
  validate(validators.blockUserSchema.http()),
  applyGuards(UserExistenceGuard),
  userController.unblock,
)

router.post(
  "/follow",
  validate(validators.followUserSchema.http()),
  applyGuards(UserExistenceGuard),
  userController.follow,
)

router.delete(
  "/un-follow",
  validate(validators.unfollowUserSchema.http()),
  applyGuards(UserExistenceGuard),
  userController.unfollow,
)

router.post(
  "/follow/accept-request",
  validate(validators.acceptFollowRequestSchema.http()),
  applyGuards(UserExistenceGuard),
  userController.acceptFollowRequest,
)

router.delete(
  "/follow/reject-request",
  validate(validators.rejectFollowRequestSchema.http()),
  applyGuards(UserExistenceGuard),
  userController.rejectFollowRequest,
)

export default router
