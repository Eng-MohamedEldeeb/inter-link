import { Router } from "express"
import { validate } from "../../../common/middlewares/validation/validation.middleware"

import * as validators from "./../validator/auth.validator"

import authController from "./auth.controller"

const router: Router = Router()

router.post(
  "/confirm-email",
  validate(validators.confirmEmailSchema.http()),
  authController.confirmEmail,
)

router.post(
  "/register",
  validate(validators.registerSchema.http()),
  authController.register,
)

router.post(
  "/login",
  validate(validators.loginSchema.http()),
  authController.login,
)

router.post(
  "/forgot-password",
  validate(validators.forgotPasswordSchema.http()),
  authController.forgotPassword,
)

router.patch(
  "/reset-password",
  validate(validators.resetPasswordSchema.http()),
  authController.resetPassword,
)

export default router
