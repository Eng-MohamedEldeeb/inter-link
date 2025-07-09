import { Router } from 'express'
import { AuthController } from './auth.controller'
import { validate } from '../../../common/middlewares/validation/validation.middleware'
import * as validators from './../validator/auth.validator'

const router: Router = Router()

router.post(
  '/confirm-email',
  validate(validators.confirmEmailSchema.http()),
  AuthController.confirmEmail,
)

router.post(
  '/register',
  validate(validators.registerSchema.http()),
  AuthController.register,
)

router.post(
  '/login',
  validate(validators.loginSchema.http()),
  AuthController.login,
)

router.post(
  '/forgot-password',
  validate(validators.forgotPasswordSchema.http()),
  AuthController.forgotPassword,
)

router.patch(
  '/reset-password',
  validate(validators.resetPasswordSchema.http()),
  AuthController.resetPassword,
)

export default router
