import { Router } from "express"

import userController from "./user.controller"

import { UserValidator } from "../../../../validators"

import {
  isBlockedUserGuard,
  userExistenceGuard,
  userPrivacyGuard,
} from "../../../../common/guards"

import { validate } from "../../../../common/middlewares/validation/validation.middleware"
import { applyGuards } from "../../../../common/decorators/guard/apply-guards.decorator"

const router: Router = Router()

router.get(
  "/",
  validate(UserValidator.getUserProfileSchema.http()),
  applyGuards(userExistenceGuard, isBlockedUserGuard, userPrivacyGuard),
  userController.getUserProfile,
)

router.get(
  "/following",
  validate(UserValidator.getUserProfileSchema.http()),
  applyGuards(userExistenceGuard, isBlockedUserGuard, userPrivacyGuard),
  userController.getUserFollowing,
)

router.get(
  "/followers",
  validate(UserValidator.getUserProfileSchema.http()),
  applyGuards(userExistenceGuard, isBlockedUserGuard, userPrivacyGuard),
  userController.getUserFollowers,
)

router.post(
  "/block",
  validate(UserValidator.blockUserSchema.http()),
  applyGuards(userExistenceGuard, isBlockedUserGuard),
  userController.block,
)

router.patch(
  "/un-block",
  validate(UserValidator.blockUserSchema.http()),
  applyGuards(userExistenceGuard),
  userController.unblock,
)

router.post(
  "/follow",
  validate(UserValidator.followUserSchema.http()),
  applyGuards(userExistenceGuard),
  userController.follow,
)

router.delete(
  "/un-follow",
  validate(UserValidator.unfollowUserSchema.http()),
  applyGuards(userExistenceGuard),
  userController.unfollow,
)

router.post(
  "/follow/accept-request",
  validate(UserValidator.acceptFollowRequestSchema.http()),
  applyGuards(userExistenceGuard),
  userController.acceptFollowRequest,
)

router.delete(
  "/follow/reject-request",
  validate(UserValidator.rejectFollowRequestSchema.http()),
  applyGuards(userExistenceGuard),
  userController.rejectFollowRequest,
)

export default router
