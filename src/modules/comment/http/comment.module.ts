import { Router } from "express"

import commentController from "./comment.controller"
import replyRouter from "./../../reply/http/reply.module"

import {
  commentExistenceGuard,
  commentOwnerGuard,
  postExistenceGuard,
} from "../../../common/guards"

import * as validators from "./../validators/comment.validators"

import { fileReader } from "../../../common/utils/multer/file-reader"
import { applyGuards } from "../../../common/decorators/guard/apply-guards.decorator"
import { validate } from "../../../common/middlewares/validation/validation.middleware"
import { commentAttachmentUploader } from "../../../common/middlewares/upload"

const router: Router = Router({ mergeParams: true })

router.use("/reply", replyRouter)

router.get(
  "/:id",
  validate(validators.getSingleCommentValidator.http()),
  applyGuards(commentExistenceGuard),
  commentController.getSingle,
)

router.post(
  "/add/:postId",
  fileReader("image/jpeg", "image/jpg", "image/png").single("attachment"),
  validate(validators.addValidator.http()),
  applyGuards(postExistenceGuard),
  commentAttachmentUploader,
  commentController.addComment,
)

router.post(
  "/like",
  validate(validators.likeValidator.http()),
  applyGuards(commentExistenceGuard),
  commentController.like,
)

router.patch(
  "/edit",
  validate(validators.editValidator.http()),
  applyGuards(commentExistenceGuard, commentOwnerGuard),
  commentController.edit,
)

router.delete(
  "/:id",
  applyGuards(commentExistenceGuard, commentOwnerGuard),
  validate(validators.deleteValidator.http()),
  commentController.deleteComment,
)

export default router
