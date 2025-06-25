import { Router } from 'express'
import { validate } from '../../middlewares/validation.middleware'
import * as validators from './validator/user.validator'
import { UserController } from './user.controller'
import { applyGuardsActivator } from '../../common/decorators/apply-activators.decorator'
import isExistedUserGuard from '../../common/guards/is-existed-user.guard'

const router: Router = Router()

router.get(
  '/:id',
  validate(validators.getUserProfileSchema),
  applyGuardsActivator(isExistedUserGuard),
  UserController.getUserProfile,
)

router.post(
  '/block/:id',
  validate(validators.blockUserSchema),
  applyGuardsActivator(isExistedUserGuard),
  UserController.blockUser,
)

router.patch(
  '/un-block/:id',
  validate(validators.blockUserSchema),
  applyGuardsActivator(isExistedUserGuard),
  UserController.blockUser,
)

export default router
