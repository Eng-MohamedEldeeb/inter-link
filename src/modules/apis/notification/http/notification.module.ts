import { Router } from "express"

import notificationController from "./notification.controller"

import { applyGuards } from "../../../../common/decorators/guard/apply-guards.decorator"
import { validate } from "../../../../common/middlewares/validation/validation.middleware"

import { NotificationValidator } from "../../../../validators"

import {
  notificationExistenceGuard,
  notificationOwnerGuard,
} from "../../../../common/guards"

const router: Router = Router()

router.get("/all", notificationController.getUserNotifications)

router.get(
  "/details/:id",
  validate(NotificationValidator.getUserNotificationsValidator.http()),
  applyGuards(notificationExistenceGuard),
  notificationController.getNotification,
)

router.delete(
  "/:id",
  applyGuards(notificationExistenceGuard, notificationOwnerGuard),
  validate(NotificationValidator.deleteNotificationValidator.http()),
  notificationController.deleteNotification,
)

export default router
