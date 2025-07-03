import { Router } from 'express'
import { AuthController } from './auth.controller'
import { validate } from '../../../common/middlewares/validation.middleware'
import * as validators from './../validator/auth.validator'

const router: Router = Router()

router.post(
  '/confirm-email',
  validate(validators.confirmEmailSchema),
  AuthController.confirmEmail,
)

router.post(
  '/register',
  validate(validators.registerSchema),
  AuthController.register,
)

router.post('/login', validate(validators.loginSchema), AuthController.login)

router.post(
  '/forgot-password',
  validate(validators.forgotPasswordSchema),
  AuthController.forgotPassword,
)

router.patch(
  '/reset-password',
  validate(validators.resetPasswordSchema),
  AuthController.resetPassword,
)

export default router
