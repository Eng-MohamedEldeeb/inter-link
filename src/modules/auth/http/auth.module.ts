import { Router } from "express"
import { validate } from "../../../common/middlewares/validation/validation.middleware"

import { AuthValidator } from "../../../validators"

import authController from "./auth.controller"

const router: Router = Router()

router.post(
  "/confirm-email",
  validate(AuthValidator.confirmEmailValidator.http()),
  authController.confirmEmail,
)

router.post(
  "/register",
  validate(AuthValidator.registerValidator.http()),
  authController.register,
)

router.post(
  "/login",
  validate(AuthValidator.loginValidator.http()),
  authController.login,
)

router.post(
  "/forgot-password",
  validate(AuthValidator.forgotPasswordValidator.http()),
  authController.forgotPassword,
)

router.patch(
  "/reset-password",
  validate(AuthValidator.resetPasswordValidator.http()),
  authController.resetPassword,
)

export default router
