import { Router } from 'express'

import { validate } from '../../../common/middlewares/validation/validation.middleware'
import * as validators from './../validators/post.validators'

import { PostController } from './post.controller'
import { fileReader } from './../../../common/utils/multer/file-reader'
import { postAttachmentUploader } from '../../../common/middlewares/http/post-attachments-uploader.middleware'

import { applyGuards } from '../../../common/decorators/guard/apply-guards.decorator'
import postExistenceGuard from '../../../common/guards/post/post-existence.guard'
import postAuthorizationGuard from '../../../common/guards/post/post-authorization.guard'
import postSharePermissionGuard from '../../../common/guards/post/post-share-permission.guard'

const router: Router = Router()

router.get(
  '/',
  validate(validators.getAllValidator.http()),
  PostController.getAll,
)

router.get(
  '/:id',
  validate(validators.getSingleValidator.http()),
  applyGuards(postExistenceGuard),
  PostController.getSingle,
)

router.post(
  '/',
  fileReader('image/jpeg', 'image/jpg', 'image/png').array('attachments', 4),
  postAttachmentUploader,
  validate(validators.createValidator),
  PostController.create,
)

router.patch(
  '/edit',
  validate(validators.editValidator.http()),
  applyGuards(postExistenceGuard, postAuthorizationGuard),
  PostController.edit,
)

router.post(
  '/save',
  validate(validators.saveValidator.http()),
  applyGuards(postExistenceGuard),
  PostController.save,
)

router.post(
  '/shared',
  validate(validators.sharedValidator.http()),
  applyGuards(postExistenceGuard, postSharePermissionGuard),
  PostController.shared,
)

router.patch(
  '/archive',
  validate(validators.archiveValidator.http()),
  applyGuards(postExistenceGuard, postAuthorizationGuard),
  PostController.archive,
)

router.patch(
  '/restore',
  validate(validators.restoreValidator.http()),
  applyGuards(postExistenceGuard, postAuthorizationGuard),
  PostController.restore,
)

router.delete(
  '/:id',
  validate(validators.deleteValidator.http()),
  applyGuards(postExistenceGuard, postAuthorizationGuard),
  PostController.delete,
)

export default router
