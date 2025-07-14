import { Router } from 'express'

import { validate } from '../../../common/middlewares/validation/validation.middleware'
import * as validators from '../validators/story.validators'

import { StoryController } from './story.controller'
import { fileReader } from '../../../common/utils/multer/file-reader'
import { storyAttachmentUploader } from '../../../common/middlewares/http/story-attachments-uploader.middleware'

import { applyGuards } from '../../../common/decorators/guard/apply-guards.decorator'

const router: Router = Router()

router.get('/', StoryController.getAll)

router.get(
  '/:id',
  validate(validators.getSingleValidator.http()),
  // applyGuards(),
  StoryController.getSingle,
)

router.post(
  '/',
  fileReader('image/jpeg', 'image/jpg', 'image/png').single('attachment'),
  storyAttachmentUploader,
  validate(validators.createValidator),
  StoryController.create,
)

router.delete(
  '/:id',
  validate(validators.deleteValidator.http()),
  // applyGuards(),
  StoryController.delete,
)

export default router
