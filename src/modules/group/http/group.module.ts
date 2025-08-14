import { Router } from 'express'
import { applyGuards } from '../../../common/decorators/guard/apply-guards.decorator'
import { validate } from '../../../common/middlewares/validation/validation.middleware'
import { GroupController } from './group.controller'

import * as validators from '../validators/group.validators'

import groupExistenceGuard from '../../../common/guards/group/group-existence.guard'
import groupMembersGuard from '../../../common/guards/group/group-members.guard'
import { fileReader } from '../../../common/utils/multer/file-reader'
import { groupCoverUploader } from '../../../common/middlewares/upload/group-cover-uploader.middleware'

const router: Router = Router()

router.get('/all', GroupController.getAllGroups)

router.get(
  '/:id',
  validate(validators.getSingleChatValidator.http()),
  applyGuards(groupExistenceGuard, groupMembersGuard),
  GroupController.getSingle,
)

router.post(
  '/create',
  fileReader('image/jpeg', 'image/jpg', 'image/png').single('cover'),
  validate(validators.createGroupValidator.http()),
  groupCoverUploader,
  GroupController.create,
)

router.post(
  '/:id/like',
  applyGuards(groupExistenceGuard, groupMembersGuard),
  validate(validators.likeMessageValidator.http()),
  GroupController.likeMessage,
)

router.patch(
  '/:id/edit-message',
  applyGuards(groupExistenceGuard, groupMembersGuard),
  validate(validators.editMessageValidator.http()),
  GroupController.editMessage,
)

router.delete(
  '/:id/delete-message',
  applyGuards(groupExistenceGuard, groupMembersGuard),
  validate(validators.deleteMessageValidator.http()),
  GroupController.deleteMessage,
)

router.patch(
  '/edit',
  applyGuards(groupExistenceGuard),
  validate(validators.editGroupValidator.http()),
  GroupController.editGroup,
)

// router.delete(
//   '/delete',
//   applyGuards(groupExistenceGuard),
//   validate(validators.deleteChatValidator.http()),
//   GroupController.deleteChat,
// )

export default router
