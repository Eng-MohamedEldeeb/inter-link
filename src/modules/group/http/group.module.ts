import { Router } from 'express'
import { applyGuards } from '../../../common/decorators/guard/apply-guards.decorator'
import { validate } from '../../../common/middlewares/validation/validation.middleware'
import { GroupController } from './group.controller'

import * as validators from '../validators/group.validators'

import chatExistenceGuard from '../../../common/guards/chat/chat-existence.guard'
import chatOwnerGuard from '../../../common/guards/chat/chat-owner.guard'
import messageExistenceGuard from '../../../common/guards/chat/message-existence.guard'

const router: Router = Router()

router.get('/all', GroupController.getAllGroups)

router.get(
  '/:groupId',
  validate(validators.getSingleChatValidator.http()),
  applyGuards(chatExistenceGuard, chatOwnerGuard),
  GroupController.getSingle,
)

router.post(
  '/create',
  validate(validators.createGroupValidator.http()),
  GroupController.create,
)

router.post(
  '/:groupId/like',
  applyGuards(chatExistenceGuard, chatOwnerGuard, messageExistenceGuard),
  validate(validators.likeMessageValidator.http()),
  GroupController.likeMessage,
)

router.patch(
  '/:groupId/edit',
  applyGuards(chatExistenceGuard, chatOwnerGuard),
  validate(validators.editMessageValidator.http()),
  GroupController.editMessage,
)

router.delete(
  '/:groupId/delete',
  applyGuards(chatExistenceGuard, chatOwnerGuard),
  validate(validators.deleteMessageValidator.http()),
  GroupController.deleteMessage,
)

router.delete(
  '/delete',
  applyGuards(chatExistenceGuard, chatOwnerGuard),
  validate(validators.deleteChatValidator.http()),
  GroupController.deleteChat,
)

export default router
