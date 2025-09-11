import { Router } from "express"
import chatController from "./chat.controller"

import { ChatValidator } from "../../../validators"

import { applyGuards } from "../../../common/decorators/guard/apply-guards.decorator"
import { validate } from "../../../common/middlewares/validation/validation.middleware"
import { chatImageUploader } from "../../../common/middlewares/upload/chat-image-upload.middleware"
import { fileReader } from "../../../common/utils/multer/file-reader"

import {
  chatExistenceGuard,
  chatOwnerGuard,
  userExistenceGuard,
  messageExistenceGuard,
} from "../../../common/guards"

const router: Router = Router()

router.get("/all", chatController.getAllChats)

router.get(
  "/:chatId",
  validate(ChatValidator.getSingleChatValidator.http()),
  applyGuards(chatExistenceGuard, chatOwnerGuard),
  chatController.getSingleChat,
)

// router.post(
//   "/:chatId/send-image",
//   fileReader("image/jpeg", "image/jpg", "image/png").single("attachment"),
//   applyGuards(chatExistenceGuard, chatOwnerGuard, userExistenceGuard),
//   chatImageUploader,
//   validate(ChatValidator.sendImageMessageValidator),
//   chatController.sendImage,
// )

// router.post(
//   "/:chatId/like-message",
//   applyGuards(chatExistenceGuard, chatOwnerGuard, messageExistenceGuard),
//   validate(ChatValidator.likeMessageValidator.http()),
//   chatController.likeMessage,
// )

// router.patch(
//   "/:chatId/edit-message",
//   applyGuards(chatExistenceGuard, chatOwnerGuard),
//   validate(ChatValidator.editMessageValidator.http()),
//   chatController.editMessage,
// )

// router.delete(
//   "/:chatId/delete-message",
//   applyGuards(chatExistenceGuard, chatOwnerGuard),
//   validate(ChatValidator.deleteMessageValidator.http()),
//   chatController.deleteMessage,
// )

// router.delete(
//   "/delete",
//   applyGuards(chatExistenceGuard, chatOwnerGuard),
//   validate(ChatValidator.deleteChatValidator.http()),
//   chatController.deleteChat,
// )

export default router
