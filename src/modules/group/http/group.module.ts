import { Router } from 'express'

import { GroupController } from './group.controller'

import { validate } from '../../../common/middlewares/validation/validation.middleware'
import * as validators from '../validators/group.validators'

import { fileReader } from '../../../common/utils/multer/file-reader'
import { groupCoverUploader } from '../../../common/middlewares/upload/group-cover-uploader.middleware'
import { groupAttachmentsUploader } from '../../../common/middlewares/upload/group-attachments-uploader.middleware'

import { applyGuards } from '../../../common/decorators/guard/apply-guards.decorator'
import groupExistenceGuard from '../../../common/guards/group/group-existence.guard'
import groupAuthorizationGuard from '../../../common/guards/group/group-authorization.guard'
import postInGroupPermissionGuard from '../../../common/guards/group/post-in-group-permission.guard'

const router: Router = Router()

router.get(
  '/:id',
  validate(validators.getGroupValidator.http()),
  applyGuards(groupExistenceGuard),
  GroupController.getGroup,
)

router.post(
  '/',
  fileReader('image/jpeg', 'image/jpg', 'image/png').single('cover'),
  validate(validators.createValidator),
  groupCoverUploader,
  GroupController.create,
)

router.post(
  '/add-post',
  fileReader('image/jpeg', 'image/jpg', 'image/png').array('attachments', 4),
  validate(validators.addPostValidator),
  applyGuards(groupExistenceGuard, postInGroupPermissionGuard),
  groupAttachmentsUploader,
  GroupController.addPost,
)

router.patch(
  '/change-cover',
  fileReader('image/jpeg', 'image/jpg', 'image/png').single('cover'),
  validate(validators.changeCoverValidator),
  applyGuards(groupExistenceGuard, groupAuthorizationGuard),
  GroupController.changeCover,
)

router.patch(
  '/edit',
  validate(validators.editValidator.http()),
  applyGuards(groupExistenceGuard, groupAuthorizationGuard),
  GroupController.edit,
)

router.patch(
  '/visibility',
  validate(validators.changeVisibilityValidator.http()),
  applyGuards(groupExistenceGuard, groupAuthorizationGuard),
  GroupController.changeVisibility,
)

router.delete(
  '/:id',
  validate(validators.deleteGroupValidator.http()),
  applyGuards(groupExistenceGuard, groupAuthorizationGuard),
  GroupController.delete,
)

export default router
