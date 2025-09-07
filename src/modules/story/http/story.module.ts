import { Router } from "express"
import { validate } from "../../../common/middlewares/validation/validation.middleware"
import { applyGuards } from "../../../common/decorators/guard/apply-guards.decorator"
import { fileReader } from "../../../common/utils/multer/file-reader"
import { storyAttachmentUploader } from "../../../common/middlewares/upload/story-attachments-uploader.middleware"

import * as validators from "../validators/story.validators"

import storyController from "./story.controller"
import storyExistenceGuard from "../../../common/guards/story/story-existence.guard"
import storyOwnerGuard from "../../../common/guards/story/story-owner.guard"
import storyViewPermissionGuard from "../../../common/guards/story/story-view-permission.guard"
import userExistenceGuard from "../../../common/guards/user/user-existence.guard"

const router: Router = Router()

router.get(
  "/",
  validate(validators.getAllValidator.http()),
  applyGuards(userExistenceGuard),
  storyController.getAll,
)

router.get(
  "/:id",
  validate(validators.getSingleValidator.http()),
  applyGuards(storyExistenceGuard, storyViewPermissionGuard),
  storyController.getSingle,
)

router.post(
  "/",
  fileReader("image/jpeg", "image/jpg", "image/png").single("attachment"),
  validate(validators.createValidator),
  storyAttachmentUploader,
  storyController.create,
)

router.post(
  "/like",
  validate(validators.likeValidator.http()),
  applyGuards(storyExistenceGuard),
  storyController.like,
)

router.delete(
  "/:id",
  validate(validators.deleteValidator.http()),
  applyGuards(storyExistenceGuard, storyOwnerGuard),
  storyController.delete,
)

export default router
