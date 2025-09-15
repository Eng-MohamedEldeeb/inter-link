import { Router } from "express"

import communityController from "./community.controller"

import { CommunityValidator } from "../../../../validators"

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
} from "../../../../common/guards"

import { validate } from "../../../../common/middlewares/validation/validation.middleware"
import { fileReader } from "../../../../common/utils/multer/file-reader"
import { applyGuards } from "../../../../common/decorators/guard/apply-guards.decorator"
import {
  communityCoverUploader,
  communityAttachmentsUploader,
} from "../../../../common/middlewares/upload"

const router: Router = Router()

router.get("/", communityController.getAllCommunities)

router.get(
  "/:communityId",
  validate(CommunityValidator.getCommunityValidator.http()),
  applyGuards(communityExistenceGuard),
  communityController.getCommunity,
)

router.get(
  "/:communityId/members",
  validate(CommunityValidator.getCommunityValidator.http()),
  applyGuards(communityExistenceGuard),
  communityController.getCommunityMembers,
)

router.post(
  "/",
  fileReader("image/jpeg", "image/jpg", "image/png").single("cover"),
  validate(CommunityValidator.createValidator.http()),
  applyGuards(communityConflictedNameGuard),
  communityCoverUploader,
  communityController.create,
)

router.post(
  "/add-post",
  fileReader("image/jpeg", "image/jpg", "image/png").array("attachments", 4),
  validate(CommunityValidator.addPostValidator),
  applyGuards(communityExistenceGuard, communityPublishPermissionGuard),
  communityAttachmentsUploader,
  communityController.addPost,
)

router.delete(
  "/:communityId/remove-post",
  validate(CommunityValidator.removePostValidator.http()),
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
  validate(CommunityValidator.changeCoverValidator),
  applyGuards(communityExistenceGuard, inCommunityAdminsGuard),
  communityController.changeCover,
)

router.patch(
  "/edit-community",
  validate(CommunityValidator.editValidator.http()),
  applyGuards(communityExistenceGuard, inCommunityAdminsGuard),
  communityController.editCommunity,
)

router.patch(
  "/change-visibility",
  validate(CommunityValidator.changeVisibilityValidator.http()),
  applyGuards(communityExistenceGuard, communityOwnerGuard),
  communityController.changeVisibility,
)

router.delete(
  "/:communityId",
  validate(CommunityValidator.deleteCommunityValidator.http()),
  applyGuards(communityExistenceGuard, communityOwnerGuard),
  communityController.deleteCommunity,
)

router.post(
  "/join",
  validate(CommunityValidator.joinCommunityValidator.http()),
  applyGuards(communityExistenceGuard),
  communityController.join,
)

router.post(
  "/accept-join-request",
  validate(CommunityValidator.acceptJoinRequestValidator.http()),
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
  validate(CommunityValidator.rejectJoinRequestValidator.http()),
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
  validate(CommunityValidator.leaveCommunityValidator.http()),
  applyGuards(communityExistenceGuard),
  communityController.leave,
)

router.patch(
  "/:communityId/kick-out",
  validate(CommunityValidator.kickOutValidator.http()),
  applyGuards(
    communityExistenceGuard,
    userExistenceGuard,
    inCommunityAdminsGuard,
  ),
  communityController.kickOut,
)

router.post(
  "/:communityId/add-admin",
  validate(CommunityValidator.addAdminValidator.http()),
  applyGuards(communityExistenceGuard, communityOwnerGuard, userExistenceGuard),
  communityController.addAdmin,
)

router.patch(
  "/:communityId/remove-admin",
  validate(CommunityValidator.removeAdminValidator.http()),
  applyGuards(communityExistenceGuard, communityOwnerGuard, userExistenceGuard),
  communityController.removeAdmin,
)

export default router
