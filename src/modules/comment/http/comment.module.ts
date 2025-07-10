import { Router } from 'express'
import { CommentController } from './comment.controller'

import { fileReader } from '../../../common/utils/multer/file-reader'
import { commentAttachmentUploader } from '../../../common/middlewares/http/comment-attachments-uploader.middleware'

import { validate } from '../../../common/middlewares/validation/validation.middleware'
import * as validators from './../validators/comment.validators'

const router: Router = Router({ mergeParams: true })

router.get('/', CommentController.getPostComments)

router.post(
  '/',
  fileReader('image/jpeg', 'image/jpg', 'image/png').single('attachment'),
  validate(validators.addValidator.http()),
  commentAttachmentUploader,
  CommentController.addComment,
)

router.delete(
  '/:commentId',
  fileReader('image/jpeg', 'image/jpg', 'image/png').single('attachment'),
  commentAttachmentUploader,
  CommentController.deleteComment,
)

export default router
