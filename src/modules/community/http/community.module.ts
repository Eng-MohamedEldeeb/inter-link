import { Router } from "express"

import communityController from "./community.controller"

import * as validators from "../validators/community.validators"

import {
  communityExistenceGuard,
  communityConflictedNameGuard,
  communityPublishPermissionGuard,
  postExistenceInCommunityGuard,
  communityPostDeletionGuard,
  inCommunityAdminsGuard,
  communityOwnerGuard,
  userExistenceGuard,
  inCommunityRequestsGuard,
} from "../../../common/guards"

import { validate } from "../../../common/middlewares/validation/validation.middleware"
import { fileReader } from "../../../common/utils/multer/file-reader"
import { applyGuards } from "../../../common/decorators/guard/apply-guards.decorator"
import {
  communityCoverUploader,
  communityAttachmentsUploader,
} from "../../../common/middlewares/upload"

const router: Router = Router()

router.get("/", communityController.getAllCommunities)

router.get(
  "/:communityId",
  validate(validators.getCommunityValidator.http()),
  applyGuards(communityExistenceGuard),
  communityController.getCommunity,
)

router.get(
  "/:communityId/members",
  validate(validators.getCommunityValidator.http()),
  applyGuards(communityExistenceGuard),
  communityController.getCommunityMembers,
)

router.post(
  "/",
  fileReader("image/jpeg", "image/jpg", "image/png").single("cover"),
  validate(validators.createValidator.http()),
  applyGuards(communityConflictedNameGuard),
  communityCoverUploader,
  communityController.create,
)

router.post(
  "/add-post",
  fileReader("image/jpeg", "image/jpg", "image/png").array("attachments", 4),
  validate(validators.addPostValidator),
  applyGuards(communityExistenceGuard, communityPublishPermissionGuard),
  communityAttachmentsUploader,
  communityController.addPost,
)

router.delete(
  "/:communityId/remove-post",
  validate(validators.removePostValidator.http()),
  applyGuards(
    communityExistenceGuard,
    postExistenceInCommunityGuard,
    communityPostDeletionGuard,
  ),
  communityController.removePost,
)

router.patch(
  "/change-cover",
  fileReader("image/jpeg", "image/jpg", "image/png").single("cover"),
  validate(validators.changeCoverValidator),
  applyGuards(communityExistenceGuard, inCommunityAdminsGuard),
  communityController.changeCover,
)

router.patch(
  "/edit-community",
  validate(validators.editValidator.http()),
  applyGuards(communityExistenceGuard, inCommunityAdminsGuard),
  communityController.editCommunity,
)

router.patch(
  "/change-visibility",
  validate(validators.changeVisibilityValidator.http()),
  applyGuards(communityExistenceGuard, communityOwnerGuard),
  communityController.changeVisibility,
)

router.delete(
  "/:communityId",
  validate(validators.deleteCommunityValidator.http()),
  applyGuards(communityExistenceGuard, communityOwnerGuard),
  communityController.deleteCommunity,
)

router.post(
  "/join",
  validate(validators.joinCommunityValidator.http()),
  applyGuards(communityExistenceGuard),
  communityController.join,
)

router.post(
  "/accept-join-request",
  validate(validators.acceptJoinRequestValidator.http()),
  applyGuards(
    communityExistenceGuard,
    userExistenceGuard,
    inCommunityRequestsGuard,
    inCommunityAdminsGuard,
  ),
  communityController.acceptJoinRequest,
)

router.delete(
  "/reject-join-request",
  validate(validators.rejectJoinRequestValidator.http()),
  applyGuards(
    communityExistenceGuard,
    userExistenceGuard,
    inCommunityRequestsGuard,
    inCommunityAdminsGuard,
  ),
  communityController.rejectJoinRequest,
)

router.patch(
  "/leave",
  validate(validators.leaveCommunityValidator.http()),
  applyGuards(communityExistenceGuard),
  communityController.leave,
)

router.patch(
  "/:communityId/kick-out",
  validate(validators.kickOutValidator.http()),
  applyGuards(
    communityExistenceGuard,
    userExistenceGuard,
    inCommunityAdminsGuard,
  ),
  communityController.kickOut,
)

router.post(
  "/:communityId/add-admin",
  validate(validators.addAdminValidator.http()),
  applyGuards(communityExistenceGuard, communityOwnerGuard, userExistenceGuard),
  communityController.addAdmin,
)

router.patch(
  "/:communityId/remove-admin",
  validate(validators.removeAdminValidator.http()),
  applyGuards(communityExistenceGuard, communityOwnerGuard, userExistenceGuard),
  communityController.removeAdmin,
)

export default router
