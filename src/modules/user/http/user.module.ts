import { Router } from 'express'
import { validate } from '../../../common/middlewares/validation/validation.middleware'
import { UserController } from './user.controller'
import { applyGuards } from '../../../common/decorators/guard/apply-guards.decorator'

import * as validators from '../validator/user.validator'

import UserExistenceGuard from '../../../common/guards/user/user-existence.guard'
import isBlockedUserGuard from '../../../common/guards/user/is-blocked-user.guard'

const router: Router = Router({ mergeParams: true })

router.get(
  '/',
  validate(validators.getUserProfileSchema.http()),
  applyGuards(UserExistenceGuard, isBlockedUserGuard),
  UserController.getUserProfile,
)

router.get(
  '/following',
  validate(validators.getUserProfileSchema.http()),
  applyGuards(UserExistenceGuard, isBlockedUserGuard),
  UserController.getUserFollowing,
)

router.get(
  '/followers',
  validate(validators.getUserProfileSchema.http()),
  applyGuards(UserExistenceGuard, isBlockedUserGuard),
  UserController.getUserFollowers,
)

router.post(
  '/block',
  validate(validators.blockUserSchema.http()),
  applyGuards(UserExistenceGuard, isBlockedUserGuard),
  UserController.block,
)

router.patch(
  '/un-block',
  validate(validators.blockUserSchema.http()),
  applyGuards(UserExistenceGuard),
  UserController.unblock,
)

router.post(
  '/follow',
  validate(validators.blockUserSchema.http()),
  applyGuards(UserExistenceGuard),
  UserController.follow,
)

router.delete(
  '/un-follow',
  validate(validators.blockUserSchema.http()),
  applyGuards(UserExistenceGuard),
  UserController.unfollow,
)

router.post(
  '/follow/accept-request',
  validate(validators.blockUserSchema.http()),
  applyGuards(UserExistenceGuard),
  UserController.acceptFollowRequest,
)

router.delete(
  '/follow/reject-request',
  validate(validators.blockUserSchema.http()),
  applyGuards(UserExistenceGuard),
  UserController.rejectFollowRequest,
)

export default router
