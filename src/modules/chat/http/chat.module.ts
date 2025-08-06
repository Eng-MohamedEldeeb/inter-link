import { Router } from 'express'
import { applyGuards } from '../../../common/decorators/guard/apply-guards.decorator'
import { validate } from '../../../common/middlewares/validation/validation.middleware'
import { ChatController } from './chat.controller'

import * as validators from '../validators/chat.validators'

import chatExistenceGuard from '../../../common/guards/chat/chat-existence.guard'
import chatOwnerGuard from '../../../common/guards/chat/chat-owner.guard'
import messageExistenceGuard from '../../../common/guards/chat/message-existence.guard'

const router: Router = Router()

router.get('/all', ChatController.getAllChats)

router.get(
  '/:chatId',
  validate(validators.getSingleChatValidator.http()),
  applyGuards(chatExistenceGuard, chatOwnerGuard),
  ChatController.getSingleChat,
)

router.post(
  '/:chatId/like',
  applyGuards(chatExistenceGuard, chatOwnerGuard, messageExistenceGuard),
  validate(validators.likeMessageValidator.http()),
  ChatController.likeMessage,
)

router.patch(
  '/:chatId/edit',
  applyGuards(chatExistenceGuard, chatOwnerGuard),
  validate(validators.editMessageValidator.http()),
  ChatController.editMessage,
)

router.delete(
  '/:chatId/delete',
  applyGuards(chatExistenceGuard, chatOwnerGuard),
  validate(validators.deleteMessageValidator.http()),
  ChatController.deleteMessage,
)

router.delete(
  '/delete',
  applyGuards(chatExistenceGuard, chatOwnerGuard),
  validate(validators.deleteChatValidator.http()),
  ChatController.deleteChat,
)

export default router
