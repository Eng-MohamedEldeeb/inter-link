import { Router } from 'express'
import { validate } from '../../middlewares/validation.middleware'
import * as validators from './validator/profile.validator'
import { ProfileController } from './profile.controller'
import { fileReader } from '../../common/utils/multer/file-reader'

const router: Router = Router()

router.patch(
  '/',
  validate(validators.updateProfileSchema),
  ProfileController.updateProfile,
)

router.patch('/visibility', ProfileController.changeVisibility)

router.patch(
  '/avatar',
  fileReader('image/jpeg', 'image/jpeg', 'image/png').single('avatar'),
  validate(validators.updateProfilePicSchema),
  ProfileController.updateProfilePic,
)

router.delete('/avatar', ProfileController.deleteProfilePic)

router.patch(
  '/change-email',
  validate(validators.changeEmailSchema),
  ProfileController.changeEmail,
)

router.post(
  '/confirm-new-email',
  validate(validators.confirmNewEmailSchema),
  ProfileController.confirmNewEmail,
)

router.delete(
  '/deactivate',
  validate(validators.deleteAccountSchema),
  ProfileController.deactivateAccount,
)

router.delete(
  '/delete-permanently',
  validate(validators.deleteAccountSchema),
  ProfileController.deleteAccount,
)

router.delete(
  '/confirm-deleting',
  validate(validators.confirmDeletionSchema),
  ProfileController.confirmDeleting,
)

export default router
