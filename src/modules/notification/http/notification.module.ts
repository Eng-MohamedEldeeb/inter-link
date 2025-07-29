import { Router } from 'express'
import { applyGuards } from '../../../common/decorators/guard/apply-guards.decorator'
import { validate } from '../../../common/middlewares/validation/validation.middleware'
import { NotificationController } from './notification.controller'

import * as validators from '../validators/notification.validators'

import NotificationExistenceGuardGuard from '../../../common/guards/notification/notification-existence.guard'
import NotificationOwnerGuardGuard from '../../../common/guards/notification/notification-owner.guard'

const router: Router = Router()

router.get(
  '/',
  validate(validators.getAllNotificationsValidator.http()),
  NotificationController.getAllNotifications,
)

router.get(
  '/:id',
  validate(validators.getAllNotificationsValidator.http()),
  applyGuards(NotificationExistenceGuardGuard),
  NotificationController.getNotification,
)

router.delete(
  '/:id',
  applyGuards(NotificationExistenceGuardGuard, NotificationOwnerGuardGuard),
  validate(validators.deleteNotificationValidator.http()),
  NotificationController.deleteNotification,
)

export default router
