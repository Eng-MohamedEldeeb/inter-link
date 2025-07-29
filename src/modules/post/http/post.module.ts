import { Router } from 'express'
import { validate } from '../../../common/middlewares/validation/validation.middleware'
import { PostController } from './post.controller'
import { fileReader } from './../../../common/utils/multer/file-reader'
import { postAttachmentUploader } from '../../../common/middlewares/upload/post-attachments-uploader.middleware'
import { applyGuards } from '../../../common/decorators/guard/apply-guards.decorator'

import * as validators from './../validators/post.validators'

import postExistenceGuard from '../../../common/guards/post/post-existence.guard'
import PostOwnerGuard from '../../../common/guards/post/post-owner.guard'
import PostSharePermissionGuardGuard from '../../../common/guards/post/post-share-permission.guard'

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
  validate(validators.createValidator),
  postAttachmentUploader,
  PostController.create,
)

router.patch(
  '/edit',
  validate(validators.editValidator.http()),
  applyGuards(postExistenceGuard, PostOwnerGuard),
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
  applyGuards(postExistenceGuard, PostSharePermissionGuardGuard),
  PostController.shared,
)

router.post(
  '/like',
  validate(validators.likeValidator.http()),
  applyGuards(postExistenceGuard),
  PostController.like,
)

router.patch(
  '/archive',
  validate(validators.archiveValidator.http()),
  applyGuards(postExistenceGuard, PostOwnerGuard),
  PostController.archive,
)

router.patch(
  '/restore',
  validate(validators.restoreValidator.http()),
  applyGuards(postExistenceGuard, PostOwnerGuard),
  PostController.restore,
)

router.delete(
  '/:id',
  validate(validators.deleteValidator.http()),
  applyGuards(postExistenceGuard, PostOwnerGuard),
  PostController.delete,
)

export default router
