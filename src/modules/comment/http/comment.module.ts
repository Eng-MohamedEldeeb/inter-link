import { Router } from 'express'
import { CommentController } from './comment.controller'
import { fileReader } from '../../../common/utils/multer/file-reader'
import { commentAttachmentUploader } from '../../../common/middlewares/upload/comment-attachments-uploader.middleware'
import { applyGuards } from '../../../common/decorators/guard/apply-guards.decorator'
import { validate } from '../../../common/middlewares/validation/validation.middleware'

import * as validators from './../validators/comment.validators'

import commentExistenceGuard from '../../../common/guards/comment/comment-existence.guard'
import CommentOwnerGuard from '../../../common/guards/comment/comment-owner.guard'
import postExistenceGuard from '../../../common/guards/post/post-existence.guard'
import replyRouter from './../../reply/http/reply.module'

const router: Router = Router({ mergeParams: true })

router.use('/reply', replyRouter)

router.get(
  '/:id',
  validate(validators.getSingleCommentValidator.http()),
  applyGuards(commentExistenceGuard),
  CommentController.getSingle,
)

router.post(
  '/add/:postId',
  fileReader('image/jpeg', 'image/jpg', 'image/png').single('attachment'),
  validate(validators.addValidator.http()),
  applyGuards(postExistenceGuard),
  commentAttachmentUploader,
  CommentController.addComment,
)

router.post(
  '/like',
  validate(validators.likeValidator.http()),
  applyGuards(commentExistenceGuard),
  CommentController.like,
)

router.patch(
  '/edit',
  validate(validators.editValidator.http()),
  applyGuards(commentExistenceGuard, CommentOwnerGuard),
  CommentController.edit,
)

router.delete(
  '/:id',
  applyGuards(commentExistenceGuard, CommentOwnerGuard),
  validate(validators.deleteValidator.http()),
  CommentController.deleteComment,
)

export default router
