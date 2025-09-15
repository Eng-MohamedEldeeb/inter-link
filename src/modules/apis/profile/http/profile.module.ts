import { Router } from "express"
import { validate } from "../../../../common/middlewares/validation/validation.middleware"
import { fileReader } from "../../../../common/utils/multer/file-reader"

import { ProfileValidator } from "../../../../validators"

import profileController from "./profile.controller"

const router: Router = Router()

router.get("/", profileController.getProfile)

router.get("/followers", profileController.getFollowers)

router.get("/following", profileController.getFollowing)

router.get(
  "/saved",
  validate(ProfileValidator.getAllSavedPostsValidator.http()),
  profileController.getAllSavedPosts,
)

router.patch(
  "/",
  validate(ProfileValidator.updateProfileSchema.http()),
  profileController.updateProfile,
)

router.patch("/visibility", profileController.changeVisibility)

router.patch(
  "/avatar",
  fileReader("image/jpeg", "image/jpeg", "image/png").single("avatar"),
  validate(ProfileValidator.updateProfilePicSchema.http()),
  profileController.changeAvatar,
)

router.delete("/avatar", profileController.deleteProfilePic)

router.patch(
  "/change-email",
  validate(ProfileValidator.changeEmailSchema.http()),
  profileController.changeEmail,
)

router.patch(
  "/confirm-new-email",
  validate(ProfileValidator.confirmNewEmailSchema.http()),
  profileController.confirmNewEmail,
)

router.delete(
  "/deactivate",
  validate(ProfileValidator.deleteAccountSchema.http()),
  profileController.deactivateAccount,
)

router.delete(
  "/delete-permanently",
  validate(ProfileValidator.deleteAccountSchema.http()),
  profileController.deleteAccount,
)

router.delete(
  "/confirm-deletion",
  validate(ProfileValidator.confirmDeletionSchema.http()),
  profileController.confirmDeletion,
)

export default router
