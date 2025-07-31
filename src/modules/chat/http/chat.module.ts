import { Router } from 'express'
import { applyGuards } from '../../../common/decorators/guard/apply-guards.decorator'
import { validate } from '../../../common/middlewares/validation/validation.middleware'
import { ChatController } from './chat.controller'

import * as validators from '../validators/chat.validators'

import chatExistenceGuard from '../../../common/guards/chat/chat-existence.guard'
import userExistenceGuard from '../../../common/guards/user/user-existence.guard'

const router: Router = Router()

router.get('/all', ChatController.getAllChats)

router.get(
  '/:currentChatId',
  validate(validators.getSingleChatValidator.http()),
  applyGuards(chatExistenceGuard),
  ChatController.getSingleChat,
)

router.post(
  '/:currentChatId/like-message',
  applyGuards(chatExistenceGuard),
  validate(validators.likeMessageValidator.http()),
  ChatController.likeMessage,
)

router.delete(
  '/:currentChatId',
  applyGuards(chatExistenceGuard),
  validate(validators.deleteChatValidator.http()),
  ChatController.deleteChat,
)

router.delete(
  '/:currentChatId/delete-message',
  applyGuards(chatExistenceGuard),
  validate(validators.deleteMessageValidator.http()),
  ChatController.deleteMessage,
)

export default router
