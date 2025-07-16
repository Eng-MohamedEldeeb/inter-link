import { Router } from 'express'
import { ProfileController } from './profile.controller'
import { validate } from '../../../common/middlewares/validation/validation.middleware'
import { fileReader } from '../../../common/utils/multer/file-reader'

import * as validators from '../validator/profile.validator'

const router: Router = Router()

router.get('/', ProfileController.getProfile)

router.get('/followers', ProfileController.getFollowers)

router.get('/following', ProfileController.getFollowing)

router.get(
  '/saved',
  validate(validators.getAllSavedPostsValidator.http()),
  ProfileController.getAllSavedPosts,
)

router.patch(
  '/',
  validate(validators.updateProfileSchema.http()),
  ProfileController.updateProfile,
)

router.patch('/visibility', ProfileController.changeVisibility)

router.patch(
  '/avatar',
  fileReader('image/jpeg', 'image/jpeg', 'image/png').single('avatar'),
  validate(validators.updateProfilePicSchema.http()),
  ProfileController.changeAvatar,
)

router.delete('/avatar', ProfileController.deleteProfilePic)

router.patch(
  '/change-email',
  validate(validators.changeEmailSchema.http()),
  ProfileController.changeEmail,
)

router.patch(
  '/confirm-new-email',
  validate(validators.confirmNewEmailSchema.http()),
  ProfileController.confirmNewEmail,
)

router.delete(
  '/deactivate',
  validate(validators.deleteAccountSchema.http()),
  ProfileController.deactivateAccount,
)

router.delete(
  '/delete-permanently',
  validate(validators.deleteAccountSchema.http()),
  ProfileController.deleteAccount,
)

router.delete(
  '/confirm-deletion',
  validate(validators.confirmDeletionSchema.http()),
  ProfileController.confirmDeletion,
)

export default router
