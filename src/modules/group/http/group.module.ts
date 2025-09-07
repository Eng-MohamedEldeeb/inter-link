import { Router } from "express"
import { applyGuards } from "../../../common/decorators/guard/apply-guards.decorator"
import { validate } from "../../../common/middlewares/validation/validation.middleware"
import { fileReader } from "../../../common/utils/multer/file-reader"
import { groupCoverUploader } from "../../../common/middlewares/upload/group-cover-uploader.middleware"

import * as validators from "../validators/group.validators"

import groupController from "./group.controller"
import groupExistenceGuard from "../../../common/guards/group/group-existence.guard"
import groupMembersGuard from "../../../common/guards/group/group-members.guard"

const router: Router = Router()

router.get("/all", groupController.getAllGroups)

router.get(
  "/:id",
  validate(validators.getSingleGroupChatValidator.http()),
  applyGuards(groupExistenceGuard, groupMembersGuard),
  groupController.getSingle,
)

router.post(
  "/create",
  fileReader("image/jpeg", "image/jpg", "image/png").single("cover"),
  validate(validators.createGroupValidator.http()),
  groupCoverUploader,
  groupController.create,
)

router.post(
  "/:id/like",
  applyGuards(groupExistenceGuard, groupMembersGuard),
  validate(validators.likeMessageValidator.http()),
  groupController.likeMessage,
)

router.patch(
  "/:id/edit-message",
  applyGuards(groupExistenceGuard, groupMembersGuard),
  validate(validators.editMessageValidator.http()),
  groupController.editMessage,
)

router.delete(
  "/:id/delete-message",
  applyGuards(groupExistenceGuard, groupMembersGuard),
  validate(validators.deleteMessageValidator.http()),
  groupController.deleteMessage,
)

router.patch(
  "/edit",
  applyGuards(groupExistenceGuard),
  validate(validators.editGroupValidator.http()),
  groupController.editGroup,
)

// router.delete(
//   '/delete',
//   applyGuards(groupExistenceGuard),
//   validate(validators.deleteChatValidator.http()),
//   groupController.deleteChat,
// )

export default router
