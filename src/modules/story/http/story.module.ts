import { Router } from 'express'
import { validate } from '../../../common/middlewares/validation/validation.middleware'
import { applyGuards } from '../../../common/decorators/guard/apply-guards.decorator'
import { fileReader } from '../../../common/utils/multer/file-reader'
import { storyAttachmentUploader } from '../../../common/middlewares/upload/story-attachments-uploader.middleware'
import { StoryController } from './story.controller'

import * as validators from '../validators/story.validators'

import storyExistenceGuard from '../../../common/guards/story/story-existence.guard'
import storyAuthorizationGuard from '../../../common/guards/story/story-authorization.guard'

const router: Router = Router()

router.get('/', StoryController.getAll)

router.get(
  '/:id',
  validate(validators.getSingleValidator.http()),
  applyGuards(storyExistenceGuard),
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
  applyGuards(storyExistenceGuard, storyAuthorizationGuard),
  StoryController.delete,
)

export default router
