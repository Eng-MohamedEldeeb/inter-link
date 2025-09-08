import { Router } from "express"

import replyController from "./reply.controller"

import * as validators from "../validators/reply.validators"

import {
  commentExistenceGuard,
  replyExistenceGuard,
  replyOwnerGuard,
} from "../../../common/guards"

import { applyGuards } from "../../../common/decorators/guard/apply-guards.decorator"
import { validate } from "../../../common/middlewares/validation/validation.middleware"

const router: Router = Router({ mergeParams: true })

router.get(
  "/:commentId",
  validate(validators.getCommentRepliesValidator.http()),
  applyGuards(commentExistenceGuard),
  replyController.getCommentReplies,
)

router.post(
  "/add/:commentId",
  validate(validators.addValidator.http()),
  applyGuards(commentExistenceGuard),
  replyController.reply,
)

router.post(
  "/like",
  validate(validators.likeValidator.http()),
  applyGuards(replyExistenceGuard),
  replyController.like,
)

router.patch(
  "/edit",
  validate(validators.editValidator.http()),
  applyGuards(replyExistenceGuard, replyOwnerGuard),
  replyController.edit,
)

router.delete(
  "/:replyId",
  applyGuards(replyExistenceGuard, replyOwnerGuard),
  validate(validators.deleteValidator.http()),
  replyController.deleteReply,
)

export default router
