import { Router } from "express"

import postController from "./post.controller"

import { PostValidator } from "../../../../validators"

import {
  postExistenceGuard,
  postOwnerGuard,
  postSharePermissionGuard,
} from "../../../../common/guards"

import { validate } from "../../../../common/middlewares/validation/validation.middleware"
import { fileReader } from "../../../../common/utils/multer/file-reader"
import { applyGuards } from "../../../../common/decorators/guard/apply-guards.decorator"
import { postAttachmentUploader } from "../../../../common/middlewares/upload"

const router: Router = Router()

router.get(
  "/",
  validate(PostValidator.getAllValidator.http()),
  postController.getAll,
)

router.get(
  "/:id",
  validate(PostValidator.getSingleValidator.http()),
  applyGuards(postExistenceGuard),
  postController.getSingle,
)

router.post(
  "/",
  fileReader("image/jpeg", "image/jpg", "image/png").array("attachments", 4),
  validate(PostValidator.createValidator),
  postAttachmentUploader,
  postController.create,
)

router.patch(
  "/edit",
  validate(PostValidator.editValidator.http()),
  applyGuards(postExistenceGuard, postOwnerGuard),
  postController.edit,
)

router.post(
  "/save",
  validate(PostValidator.saveValidator.http()),
  applyGuards(postExistenceGuard),
  postController.save,
)

router.post(
  "/shared",
  validate(PostValidator.sharedValidator.http()),
  applyGuards(postExistenceGuard, postSharePermissionGuard),
  postController.shared,
)

router.post(
  "/like",
  validate(PostValidator.likeValidator.http()),
  applyGuards(postExistenceGuard),
  postController.like,
)

router.patch(
  "/archive",
  validate(PostValidator.archiveValidator.http()),
  applyGuards(postExistenceGuard, postOwnerGuard),
  postController.archive,
)

router.patch(
  "/restore",
  validate(PostValidator.restoreValidator.http()),
  applyGuards(postExistenceGuard, postOwnerGuard),
  postController.restore,
)

router.delete(
  "/:id",
  validate(PostValidator.deleteValidator.http()),
  applyGuards(postExistenceGuard, postOwnerGuard),
  postController.delete,
)

export default router
