import { Router } from "express"
import { validate } from "../../../common/middlewares/validation/validation.middleware"
import { fileReader } from "../../../common/utils/multer/file-reader"

import * as validators from "../validator/profile.validator"

import profileController from "./profile.controller"

const router: Router = Router()

router.get("/", profileController.getProfile)

router.get("/followers", profileController.getFollowers)

router.get("/following", profileController.getFollowing)

router.get(
  "/saved",
  validate(validators.getAllSavedPostsValidator.http()),
  profileController.getAllSavedPosts,
)

router.patch(
  "/",
  validate(validators.updateProfileSchema.http()),
  profileController.updateProfile,
)

router.patch("/visibility", profileController.changeVisibility)

router.patch(
  "/avatar",
  fileReader("image/jpeg", "image/jpeg", "image/png").single("avatar"),
  validate(validators.updateProfilePicSchema.http()),
  profileController.changeAvatar,
)

router.delete("/avatar", profileController.deleteProfilePic)

router.patch(
  "/change-email",
  validate(validators.changeEmailSchema.http()),
  profileController.changeEmail,
)

router.patch(
  "/confirm-new-email",
  validate(validators.confirmNewEmailSchema.http()),
  profileController.confirmNewEmail,
)

router.delete(
  "/deactivate",
  validate(validators.deleteAccountSchema.http()),
  profileController.deactivateAccount,
)

router.delete(
  "/delete-permanently",
  validate(validators.deleteAccountSchema.http()),
  profileController.deleteAccount,
)

router.delete(
  "/confirm-deletion",
  validate(validators.confirmDeletionSchema.http()),
  profileController.confirmDeletion,
)

export default router
