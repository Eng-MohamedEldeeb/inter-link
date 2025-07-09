import { Router } from 'express'

import { validate } from '../../../common/middlewares/validation/validation.middleware'
import * as validators from './../validators/post.validators'

import { PostController } from './post.controller'
import { fileReader } from './../../../common/utils/multer/file-reader'
import { uploadAttachments } from './../../../common/middlewares/http/upload-attachments.middleware'

import { applyGuards } from '../../../common/decorators/guard/apply-guards.decorator'
import PostExistenceGuard from './../../../common/guards/post-existence.guard'
import postAuthorizationGuard from './../../../common/guards/post-authorization.guard'

const router: Router = Router()

router.get(
  '/',
  validate(validators.getAllValidator.http()),
  PostController.getAll,
)

router.get(
  '/:id',
  validate(validators.getSingleValidator.http()),
  applyGuards(PostExistenceGuard),
  PostController.getSingle,
)

router.post(
  '/',
  fileReader('image/jpeg', 'image/jpg', 'image/png').array('attachments', 4),
  uploadAttachments('posts'),
  validate(validators.createValidator),
  PostController.create,
)

router.patch(
  '/edit',
  validate(validators.editValidator.http()),
  applyGuards(PostExistenceGuard, postAuthorizationGuard),
  PostController.edit,
)

router.patch(
  '/archive',
  validate(validators.archiveValidator.http()),
  applyGuards(PostExistenceGuard, postAuthorizationGuard),
  PostController.archive,
)

router.patch(
  '/restore',
  validate(validators.restoreValidator.http()),
  applyGuards(PostExistenceGuard, postAuthorizationGuard),
  PostController.restore,
)

router.delete(
  '/:id',
  validate(validators.deleteValidator.http()),
  applyGuards(PostExistenceGuard, postAuthorizationGuard),
  PostController.delete,
)

export default router
