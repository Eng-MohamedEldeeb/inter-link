import { Router } from "express"
import { validate } from "../../../common/middlewares/validation/validation.middleware"
import { fileReader } from "./../../../common/utils/multer/file-reader"
import { postAttachmentUploader } from "../../../common/middlewares/upload/post-attachments-uploader.middleware"
import { applyGuards } from "../../../common/decorators/guard/apply-guards.decorator"

import * as validators from "./../validators/post.validators"

import postController from "./post.controller"
import postExistenceGuard from "../../../common/guards/post/post-existence.guard"
import PostOwnerGuard from "../../../common/guards/post/post-owner.guard"
import PostSharePermissionGuardGuard from "../../../common/guards/post/post-share-permission.guard"

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
  applyGuards(postExistenceGuard, PostOwnerGuard),
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
  applyGuards(postExistenceGuard, PostSharePermissionGuardGuard),
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
  applyGuards(postExistenceGuard, PostOwnerGuard),
  postController.archive,
)

router.patch(
  "/restore",
  validate(validators.restoreValidator.http()),
  applyGuards(postExistenceGuard, PostOwnerGuard),
  postController.restore,
)

router.delete(
  "/:id",
  validate(validators.deleteValidator.http()),
  applyGuards(postExistenceGuard, PostOwnerGuard),
  postController.delete,
)

export default router
