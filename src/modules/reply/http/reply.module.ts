import { Router } from 'express'
import { applyGuards } from '../../../common/decorators/guard/apply-guards.decorator'
import { validate } from '../../../common/middlewares/validation/validation.middleware'
import { ReplyController } from './reply.controller'

import * as validators from '../validators/reply.validators'

import replyExistenceGuard from '../../../common/guards/reply/reply-existence.guard'
import replyAuthorizationGuard from '../../../common/guards/reply/reply-authorization.guard'
import commentExistenceGuard from '../../../common/guards/comment/comment-existence.guard'

const router: Router = Router({ mergeParams: true })

router.get(
  '/:commentId',
  validate(validators.getCommentRepliesValidator.http()),
  applyGuards(replyExistenceGuard),
  ReplyController.getCommentReplies,
)

router.post(
  '/add/:commentId',
  validate(validators.addValidator.http()),
  applyGuards(commentExistenceGuard),
  ReplyController.reply,
)

router.post(
  '/like',
  validate(validators.likeValidator.http()),
  applyGuards(replyExistenceGuard),
  ReplyController.like,
)

router.patch(
  '/edit',
  validate(validators.editValidator.http()),
  applyGuards(replyExistenceGuard, replyAuthorizationGuard),
  ReplyController.edit,
)

router.delete(
  '/:replyId',
  applyGuards(replyExistenceGuard, replyAuthorizationGuard),
  validate(validators.deleteValidator.http()),
  ReplyController.deleteReply,
)

export default router
