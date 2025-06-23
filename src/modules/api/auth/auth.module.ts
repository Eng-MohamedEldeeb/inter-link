import { Router } from 'express'
import { AuthController } from './auth.controller'
import { validate } from '../../../middlewares/validation.middleware'
import * as validators from './validator/auth.validator'
import { applyRateLimiter } from '../../../common/decorators/rate-limiter.decorator'

const router: Router = Router()

router.use(applyRateLimiter()).post(
  '/confirm-email',

  validate(validators.confirmEmailSchema),
  AuthController.confirmEmail,
)

router.post(
  '/register',
  validate(validators.registerSchema),
  AuthController.register,
)

router
  .use(applyRateLimiter())
  .post('/login', validate(validators.loginSchema), AuthController.login)

router
  .use(applyRateLimiter())
  .post(
    '/forgot-password',
    validate(validators.forgotPasswordSchema),
    AuthController.forgotPassword,
  )

router.patch(
  '/reset-password',
  validate(validators.resetPasswordSchema),
  AuthController.resetPassword,
)

router
  .use(applyRateLimiter())
  .delete(
    '/delete-account',
    validate(validators.deleteAccountSchema),
    AuthController.deleteAccount,
  )

router.delete(
  '/confirm-deleting',
  validate(validators.confirmDeleteSchema),
  AuthController.confirmDeleting,
)

export default router
