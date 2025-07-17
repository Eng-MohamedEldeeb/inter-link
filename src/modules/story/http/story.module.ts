import { Router } from 'express'
import { validate } from '../../../common/middlewares/validation/validation.middleware'
import { applyGuards } from '../../../common/decorators/guard/apply-guards.decorator'
import { fileReader } from '../../../common/utils/multer/file-reader'
import { storyAttachmentUploader } from '../../../common/middlewares/upload/story-attachments-uploader.middleware'
import { StoryController } from './story.controller'

import * as validators from '../validators/story.validators'

import storyExistenceGuard from '../../../common/guards/story/story-existence.guard'
import storyAuthorizationGuard from '../../../common/guards/story/story-authorization.guard'
import storyViewPermissionGuard from '../../../common/guards/story/story-view-permission.guard'
import userExistenceGuard from '../../../common/guards/user/user-existence.guard'

const router: Router = Router()

router.get(
  '/',
  validate(validators.getAllValidator.http()),
  applyGuards(userExistenceGuard),
  StoryController.getAll,
)

router.get(
  '/:id',
  validate(validators.getSingleValidator.http()),
  applyGuards(storyExistenceGuard, storyViewPermissionGuard),
  StoryController.getSingle,
)

router.post(
  '/',
  fileReader('image/jpeg', 'image/jpg', 'image/png').single('attachment'),
  validate(validators.createValidator),
  storyAttachmentUploader,
  StoryController.create,
)

router.delete(
  '/:id',
  validate(validators.deleteValidator.http()),
  applyGuards(storyExistenceGuard, storyAuthorizationGuard),
  StoryController.delete,
)

export default router
