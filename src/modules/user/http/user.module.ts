import { Router } from 'express'

import { validate } from '../../../common/middlewares/validation/validation.middleware'
import * as validators from '../validator/user.validator'

import { UserController } from './user.controller'

import { applyGuards } from '../../../common/decorators/guard/apply-guards.decorator'
import UserExistenceGuard from '../../../common/guards/user-existence.guard'
import isBlockedUserGuard from '../../../common/guards/is-blocked-user.guard'

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
  UserController.getUseFollowing,
)

router.get(
  '/followers',
  validate(validators.getUserProfileSchema.http()),
  applyGuards(UserExistenceGuard, isBlockedUserGuard),
  UserController.getUseFollowers,
)

router.post(
  '/block/:id',
  validate(validators.blockUserSchema.http()),
  applyGuards(UserExistenceGuard, isBlockedUserGuard),
  UserController.blockUser,
)

router.patch(
  '/un-block/:id',
  validate(validators.blockUserSchema.http()),
  applyGuards(UserExistenceGuard),
  UserController.unblockUser,
)

export default router
