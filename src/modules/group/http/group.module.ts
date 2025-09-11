import { Router } from "express"

import groupController from "./group.controller"

import { GroupValidator } from "../../../validators"

import { applyGuards } from "../../../common/decorators/guard/apply-guards.decorator"
import { validate } from "../../../common/middlewares/validation/validation.middleware"
import { fileReader } from "../../../common/utils/multer/file-reader"

import { groupExistenceGuard, groupMembersGuard } from "../../../common/guards"
import { groupCoverUploader } from "../../../common/middlewares/upload"

const router: Router = Router()

router.get("/all", groupController.getAllGroups)

router.get(
  "/:id",
  validate(GroupValidator.getSingleGroupChatValidator.http()),
  applyGuards(groupExistenceGuard, groupMembersGuard),
  groupController.getSingle,
)

router.post(
  "/create",
  fileReader("image/jpeg", "image/jpg", "image/png").single("cover"),
  validate(GroupValidator.createGroupValidator.http()),
  groupCoverUploader,
  groupController.create,
)

router.post(
  "/:id/like",
  applyGuards(groupExistenceGuard, groupMembersGuard),
  validate(GroupValidator.likeMessageValidator.http()),
  groupController.likeMessage,
)

router.patch(
  "/:id/edit-message",
  applyGuards(groupExistenceGuard, groupMembersGuard),
  validate(GroupValidator.editMessageValidator.http()),
  groupController.editMessage,
)

router.delete(
  "/:id/delete-message",
  applyGuards(groupExistenceGuard, groupMembersGuard),
  validate(GroupValidator.deleteMessageValidator.http()),
  groupController.deleteMessage,
)

router.patch(
  "/edit",
  applyGuards(groupExistenceGuard),
  validate(GroupValidator.editGroupValidator.http()),
  groupController.editGroup,
)

// router.delete(
//   '/delete',
//   applyGuards(groupExistenceGuard),
//   validate(GroupValidator.deleteChatValidator.http()),
//   groupController.deleteChat,
// )

export default router
