import { Router } from "express"
import { applyGuards } from "../../../common/decorators/guard/apply-guards.decorator"
import { validate } from "../../../common/middlewares/validation/validation.middleware"

import * as validators from "../validators/notification.validators"

import notificationController from "./notification.controller"
import NotificationExistenceGuardGuard from "../../../common/guards/notification/notification-existence.guard"
import NotificationOwnerGuardGuard from "../../../common/guards/notification/notification-owner.guard"

const router: Router = Router()

router.get(
  "/",
  validate(validators.getAllNotificationsValidator.http()),
  notificationController.getAllNotifications,
)

router.get(
  "/:id",
  validate(validators.getAllNotificationsValidator.http()),
  applyGuards(NotificationExistenceGuardGuard),
  notificationController.getNotification,
)

router.delete(
  "/:id",
  applyGuards(NotificationExistenceGuardGuard, NotificationOwnerGuardGuard),
  validate(validators.deleteNotificationValidator.http()),
  notificationController.deleteNotification,
)

export default router
