import { Router } from "express"

import replyController from "./reply.controller"

import { ReplyValidator } from "../../../../validators"

import {
  commentExistenceGuard,
  replyExistenceGuard,
  replyOwnerGuard,
} from "../../../../common/guards"

import { applyGuards } from "../../../../common/decorators/guard/apply-guards.decorator"
import { validate } from "../../../../common/middlewares/validation/validation.middleware"

const router: Router = Router({ mergeParams: true })

router.get(
  "/:commentId",
  validate(ReplyValidator.getCommentRepliesValidator.http()),
  applyGuards(commentExistenceGuard),
  replyController.getCommentReplies,
)

router.post(
  "/add/:commentId",
  validate(ReplyValidator.addValidator.http()),
  applyGuards(commentExistenceGuard),
  replyController.reply,
)

router.post(
  "/like",
  validate(ReplyValidator.likeValidator.http()),
  applyGuards(replyExistenceGuard),
  replyController.like,
)

router.patch(
  "/edit",
  validate(ReplyValidator.editValidator.http()),
  applyGuards(replyExistenceGuard, replyOwnerGuard),
  replyController.edit,
)

router.delete(
  "/:replyId",
  applyGuards(replyExistenceGuard, replyOwnerGuard),
  validate(ReplyValidator.deleteValidator.http()),
  replyController.deleteReply,
)

export default router
