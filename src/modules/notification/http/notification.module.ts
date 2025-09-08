import { Router } from "express"

import notificationController from "./notification.controller"

import { applyGuards } from "../../../common/decorators/guard/apply-guards.decorator"
import { validate } from "../../../common/middlewares/validation/validation.middleware"

import * as validators from "../validators/notification.validators"

import {
  notificationExistenceGuard,
  notificationOwnerGuard,
} from "../../../common/guards"

const router: Router = Router()

router.get(
  "/",
  validate(validators.getUserNotificationsValidator.http()),
  notificationController.getUserNotifications,
)

router.get(
  "/:id",
  validate(validators.getUserNotificationsValidator.http()),
  applyGuards(notificationExistenceGuard),
  notificationController.getNotification,
)

router.delete(
  "/:id",
  applyGuards(notificationExistenceGuard, notificationOwnerGuard),
  validate(validators.deleteNotificationValidator.http()),
  notificationController.deleteNotification,
)

export default router
