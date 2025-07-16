import { Router } from 'express'
import { CommentController } from './comment.controller'
import { fileReader } from '../../../common/utils/multer/file-reader'
import { commentAttachmentUploader } from '../../../common/middlewares/upload/comment-attachments-uploader.middleware'
import { applyGuards } from '../../../common/decorators/guard/apply-guards.decorator'
import { validate } from '../../../common/middlewares/validation/validation.middleware'

import * as validators from './../validators/comment.validators'

import commentExistenceGuard from '../../../common/guards/comment/comment-existence.guard'
import commentAuthorizationGuard from '../../../common/guards/comment/comment-authorization.guard'
import postExistenceGuard from '../../../common/guards/post/post-existence.guard'
import replyRouter from './../../reply/http/reply.module'

const router: Router = Router({ mergeParams: true })

router.use('/reply', replyRouter)

router.get(
  '/:commentId',
  validate(validators.getSingleCommentValidator.http()),
  applyGuards(commentExistenceGuard),
  CommentController.getSingle,
)

router.post(
  '/:postId',
  fileReader('image/jpeg', 'image/jpg', 'image/png').single('attachment'),
  validate(validators.addValidator.http()),
  applyGuards(postExistenceGuard),
  commentAttachmentUploader,
  CommentController.addComment,
)

router.patch(
  '/:commentId',
  validate(validators.editValidator.http()),
  applyGuards(commentExistenceGuard, commentAuthorizationGuard),
  CommentController.edit,
)

router.delete(
  '/:commentId',
  applyGuards(commentExistenceGuard, commentAuthorizationGuard),
  validate(validators.deleteValidator.http()),
  CommentController.deleteComment,
)

export default router
