import { Router } from "express"

import userController from "./user.controller"

import * as validators from "../validator/user.validator"

import {
  isBlockedUserGuard,
  userExistenceGuard,
  userPrivacyGuard,
} from "../../../common/guards"

import { validate } from "../../../common/middlewares/validation/validation.middleware"
import { applyGuards } from "../../../common/decorators/guard/apply-guards.decorator"

const router: Router = Router()

router.get(
  "/",
  validate(validators.getUserProfileSchema.http()),
  applyGuards(userExistenceGuard, isBlockedUserGuard, userPrivacyGuard),
  userController.getUserProfile,
)

router.get(
  "/following",
  validate(validators.getUserProfileSchema.http()),
  applyGuards(userExistenceGuard, isBlockedUserGuard, userPrivacyGuard),
  userController.getUserFollowing,
)

router.get(
  "/followers",
  validate(validators.getUserProfileSchema.http()),
  applyGuards(userExistenceGuard, isBlockedUserGuard, userPrivacyGuard),
  userController.getUserFollowers,
)

router.post(
  "/block",
  validate(validators.blockUserSchema.http()),
  applyGuards(userExistenceGuard, isBlockedUserGuard),
  userController.block,
)

router.patch(
  "/un-block",
  validate(validators.blockUserSchema.http()),
  applyGuards(userExistenceGuard),
  userController.unblock,
)

router.post(
  "/follow",
  validate(validators.followUserSchema.http()),
  applyGuards(userExistenceGuard),
  userController.follow,
)

router.delete(
  "/un-follow",
  validate(validators.unfollowUserSchema.http()),
  applyGuards(userExistenceGuard),
  userController.unfollow,
)

router.post(
  "/follow/accept-request",
  validate(validators.acceptFollowRequestSchema.http()),
  applyGuards(userExistenceGuard),
  userController.acceptFollowRequest,
)

router.delete(
  "/follow/reject-request",
  validate(validators.rejectFollowRequestSchema.http()),
  applyGuards(userExistenceGuard),
  userController.rejectFollowRequest,
)

export default router
