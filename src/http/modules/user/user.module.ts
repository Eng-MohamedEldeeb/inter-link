import { Router } from 'express'
import { validate } from '../../../common/middlewares/validation.middleware'
import * as validators from './validator/user.validator'
import { UserController } from './user.controller'
import { applyGuardsActivator } from '../../../common/decorators/apply-activators.decorator'
import isExistedUserGuard from '../../../common/guards/is-existed-user.guard'
import isBlockedUserGuard from '../../../common/guards/is-blocked-user.guard'

const router: Router = Router({ mergeParams: true })

router.get(
  '/',
  validate(validators.getUserProfileSchema),
  applyGuardsActivator(isExistedUserGuard, isBlockedUserGuard),
  UserController.getUserProfile,
)

router.get(
  '/following',
  validate(validators.getUserProfileSchema),
  applyGuardsActivator(isExistedUserGuard, isBlockedUserGuard),
  UserController.getUseFollowing,
)

router.get(
  '/followers',
  validate(validators.getUserProfileSchema),
  applyGuardsActivator(isExistedUserGuard, isBlockedUserGuard),
  UserController.getUseFollowers,
)

router.post(
  '/block/:id',
  validate(validators.blockUserSchema),
  applyGuardsActivator(isExistedUserGuard, isBlockedUserGuard),
  UserController.blockUser,
)

router.patch(
  '/un-block/:id',
  validate(validators.blockUserSchema),
  applyGuardsActivator(isExistedUserGuard),
  UserController.unblockUser,
)

export default router
