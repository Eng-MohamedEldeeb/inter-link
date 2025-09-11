import { Router } from "express"

import commentController from "./comment.controller"
import replyRouter from "./../../reply/http/reply.module"

import {
  commentExistenceGuard,
  commentOwnerGuard,
  postExistenceGuard,
} from "../../../common/guards"

import { CommentValidator } from "../../../validators"

import { fileReader } from "../../../common/utils/multer/file-reader"
import { applyGuards } from "../../../common/decorators/guard/apply-guards.decorator"
import { validate } from "../../../common/middlewares/validation/validation.middleware"
import { commentAttachmentUploader } from "../../../common/middlewares/upload"

const router: Router = Router({ mergeParams: true })

router.use("/reply", replyRouter)

router.get(
  "/:id",
  validate(CommentValidator.getSingleCommentValidator.http()),
  applyGuards(commentExistenceGuard),
  commentController.getSingle,
)

router.post(
  "/add/:postId",
  fileReader("image/jpeg", "image/jpg", "image/png").single("attachment"),
  validate(CommentValidator.addValidator.http()),
  applyGuards(postExistenceGuard),
  commentAttachmentUploader,
  commentController.addComment,
)

router.post(
  "/like",
  validate(CommentValidator.likeValidator.http()),
  applyGuards(commentExistenceGuard),
  commentController.like,
)

router.patch(
  "/edit",
  validate(CommentValidator.editValidator.http()),
  applyGuards(commentExistenceGuard, commentOwnerGuard),
  commentController.edit,
)

router.delete(
  "/:id",
  applyGuards(commentExistenceGuard, commentOwnerGuard),
  validate(CommentValidator.deleteValidator.http()),
  commentController.deleteComment,
)

export default router
