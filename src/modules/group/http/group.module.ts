import { Router } from 'express'
import { GroupController } from './group.controller'
import { validate } from '../../../common/middlewares/validation/validation.middleware'
import { fileReader } from '../../../common/utils/multer/file-reader'
import { groupCoverUploader } from '../../../common/middlewares/upload/group-cover-uploader.middleware'
import { groupAttachmentsUploader } from '../../../common/middlewares/upload/group-attachments-uploader.middleware'
import { applyGuards } from '../../../common/decorators/guard/apply-guards.decorator'

import * as validators from '../validators/group.validators'

import groupExistenceGuard from '../../../common/guards/group/group-existence.guard'
import groupOwnerAuthorizationGuard from '../../../common/guards/group/group-owner-authorization.guard'
import postInGroupPermissionGuard from '../../../common/guards/group/post-in-group-permission.guard'
import postExistenceInGroupGuard from '../../../common/guards/group/post-existence-in-group.guard'
import groupAdminsAuthorizationGuard from '../../../common/guards/group/group-admins-authorization.guard'
import userExistenceGuard from '../../../common/guards/user/user-existence.guard'
import groupConflictedNameGuard from '../../../common/guards/group/group-conflicted-name.guard'

const router: Router = Router()

router.get(
  '/:groupId',
  validate(validators.getGroupValidator.http()),
  applyGuards(groupExistenceGuard),
  GroupController.getGroup,
)

router.post(
  '/',
  fileReader('image/jpeg', 'image/jpg', 'image/png').single('cover'),
  validate(validators.createValidator),
  applyGuards(groupConflictedNameGuard),
  groupCoverUploader,
  GroupController.create,
)

router.post(
  '/:groupId/add-admin',
  validate(validators.addAdminValidator.http()),
  applyGuards(
    groupExistenceGuard,
    groupOwnerAuthorizationGuard,
    userExistenceGuard,
  ),
  GroupController.addAdmin,
)

router.patch(
  '/:groupId/remove-admin',
  validate(validators.removeAdminValidator.http()),
  applyGuards(
    groupExistenceGuard,
    groupOwnerAuthorizationGuard,
    userExistenceGuard,
  ),
  GroupController.removeAdmin,
)

router.post(
  '/add-post',
  fileReader('image/jpeg', 'image/jpg', 'image/png').array('attachments', 4),
  validate(validators.addPostValidator),
  applyGuards(groupExistenceGuard, postInGroupPermissionGuard),
  groupAttachmentsUploader,
  GroupController.addPost,
)

router.delete(
  '/:groupId/remove-post',
  validate(validators.removePostValidator.http()),
  applyGuards(
    groupExistenceGuard,
    groupAdminsAuthorizationGuard,
    postExistenceInGroupGuard,
  ),
  GroupController.removePost,
)

router.patch(
  '/change-cover',
  fileReader('image/jpeg', 'image/jpg', 'image/png').single('cover'),
  validate(validators.changeCoverValidator),
  applyGuards(groupExistenceGuard, groupAdminsAuthorizationGuard),
  GroupController.changeCover,
)

router.patch(
  '/edit',
  validate(validators.editValidator.http()),
  applyGuards(groupExistenceGuard, groupAdminsAuthorizationGuard),
  GroupController.edit,
)

router.patch(
  '/change-visibility',
  validate(validators.changeVisibilityValidator.http()),
  applyGuards(groupExistenceGuard, groupOwnerAuthorizationGuard),
  GroupController.changeVisibility,
)

router.delete(
  '/:groupId',
  validate(validators.deleteGroupValidator.http()),
  applyGuards(groupExistenceGuard, groupOwnerAuthorizationGuard),
  GroupController.delete,
)

export default router
