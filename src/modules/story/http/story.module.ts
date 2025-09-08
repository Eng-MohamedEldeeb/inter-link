import { Router } from "express"

import storyController from "./story.controller"

import * as validators from "../validators/story.validators"

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
