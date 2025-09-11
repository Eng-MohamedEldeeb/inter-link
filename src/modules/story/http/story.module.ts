import { Router } from "express"

import storyController from "./story.controller"

import { StoryValidator } from "../../../validators"

import {
  userExistenceGuard,
  storyExistenceGuard,
  storyViewPermissionGuard,
  storyOwnerGuard,
} from "../../../common/guards"

import { validate } from "../../../common/middlewares/validation/validation.middleware"
import { applyGuards } from "../../../common/decorators/guard/apply-guards.decorator"
import { fileReader } from "../../../common/utils/multer/file-reader"
import { storyAttachmentUploader } from "../../../common/middlewares/upload"

const router: Router = Router()

router.get(
  "/",
  validate(StoryValidator.getAllValidator.http()),
  applyGuards(userExistenceGuard),
  storyController.getAll,
)

router.get(
  "/:id",
  validate(StoryValidator.getSingleValidator.http()),
  applyGuards(storyExistenceGuard, storyViewPermissionGuard),
  storyController.getSingle,
)

router.post(
  "/",
  fileReader("image/jpeg", "image/jpg", "image/png").single("attachment"),
  validate(StoryValidator.createValidator),
  storyAttachmentUploader,
  storyController.create,
)

router.post(
  "/like",
  validate(StoryValidator.likeValidator.http()),
  applyGuards(storyExistenceGuard),
  storyController.like,
)

router.delete(
  "/:id",
  validate(StoryValidator.deleteValidator.http()),
  applyGuards(storyExistenceGuard, storyOwnerGuard),
  storyController.delete,
)

export default router
