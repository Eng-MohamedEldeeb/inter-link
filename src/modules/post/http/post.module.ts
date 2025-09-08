import { Router } from "express"

import postController from "./post.controller"

import * as validators from "./../validators/post.validators"

import {
  postExistenceGuard,
  postOwnerGuard,
  postSharePermissionGuard,
} from "../../../common/guards"

import { validate } from "../../../common/middlewares/validation/validation.middleware"
import { fileReader } from "./../../../common/utils/multer/file-reader"
import { applyGuards } from "../../../common/decorators/guard/apply-guards.decorator"
import { postAttachmentUploader } from "../../../common/middlewares/upload"

const router: Router = Router()

router.get(
  "/",
  validate(validators.getAllValidator.http()),
  postController.getAll,
)

router.get(
  "/:id",
  validate(validators.getSingleValidator.http()),
  applyGuards(postExistenceGuard),
  postController.getSingle,
)

router.post(
  "/",
  fileReader("image/jpeg", "image/jpg", "image/png").array("attachments", 4),
  validate(validators.createValidator),
  postAttachmentUploader,
  postController.create,
)

router.patch(
  "/edit",
  validate(validators.editValidator.http()),
  applyGuards(postExistenceGuard, postOwnerGuard),
  postController.edit,
)

router.post(
  "/save",
  validate(validators.saveValidator.http()),
  applyGuards(postExistenceGuard),
  postController.save,
)

router.post(
  "/shared",
  validate(validators.sharedValidator.http()),
  applyGuards(postExistenceGuard, postSharePermissionGuard),
  postController.shared,
)

router.post(
  "/like",
  validate(validators.likeValidator.http()),
  applyGuards(postExistenceGuard),
  postController.like,
)

router.patch(
  "/archive",
  validate(validators.archiveValidator.http()),
  applyGuards(postExistenceGuard, postOwnerGuard),
  postController.archive,
)

router.patch(
  "/restore",
  validate(validators.restoreValidator.http()),
  applyGuards(postExistenceGuard, postOwnerGuard),
  postController.restore,
)

router.delete(
  "/:id",
  validate(validators.deleteValidator.http()),
  applyGuards(postExistenceGuard, postOwnerGuard),
  postController.delete,
)

export default router
