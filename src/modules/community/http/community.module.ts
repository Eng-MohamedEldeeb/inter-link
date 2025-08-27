import { Router } from 'express'
import { CommunityController } from './community.controller'
import { validate } from '../../../common/middlewares/validation/validation.middleware'
import { fileReader } from '../../../common/utils/multer/file-reader'
import { communityCoverUploader } from '../../../common/middlewares/upload/community-cover-uploader.middleware'
import { communityAttachmentsUploader } from '../../../common/middlewares/upload/community-attachments-uploader.middleware'
import { applyGuards } from '../../../common/decorators/guard/apply-guards.decorator'

import * as validators from '../validators/community.validators'

import communityExistenceGuard from '../../../common/guards/community/community-existence.guard'
import communityOwnerGuard from '../../../common/guards/community/community-owner-authorization.guard'
import communityPublishPermissionGuard from '../../../common/guards/community/community-publish-permission.guard'
import postExistenceInCommunityGuard from '../../../common/guards/community/post-existence-in-community.guard'
import communityAdminsGuard from '../../../common/guards/community/in-community-admins.guard'
import userExistenceGuard from '../../../common/guards/user/user-existence.guard'
import communityConflictedNameGuard from '../../../common/guards/community/community-conflicted-name.guard'
import inCommunityRequestsGuard from '../../../common/guards/community/in-community-requests.guard'
import communityPostDeletionGuard from '../../../common/guards/community/community-post-deletion.guard'
import inCommunityMembersGuard from '../../../common/guards/community/in-community-members.guard'

const router: Router = Router()

router.get('/', CommunityController.getAllCommunities)

router.get(
  '/:communityId',
  validate(validators.getCommunityValidator.http()),
  applyGuards(communityExistenceGuard),
  CommunityController.getCommunity,
)

router.get(
  '/:communityId/members',
  validate(validators.getCommunityValidator.http()),
  applyGuards(communityExistenceGuard),
  CommunityController.getCommunityMembers,
)

router.post(
  '/',
  fileReader('image/jpeg', 'image/jpg', 'image/png').single('cover'),
  validate(validators.createValidator),
  applyGuards(communityConflictedNameGuard),
  communityCoverUploader,
  CommunityController.create,
)

router.post(
  '/join',
  validate(validators.joinCommunityValidator.http()),
  applyGuards(communityExistenceGuard),
  CommunityController.join,
)

router.post(
  '/accept-join-request',
  validate(validators.acceptJoinRequestValidator.http()),
  applyGuards(
    communityExistenceGuard,
    userExistenceGuard,
    inCommunityRequestsGuard,
    communityAdminsGuard,
  ),
  CommunityController.acceptJoinRequest,
)

router.delete(
  '/reject-join-request',
  validate(validators.acceptJoinRequestValidator.http()),
  applyGuards(
    communityExistenceGuard,
    userExistenceGuard,
    inCommunityRequestsGuard,
    communityAdminsGuard,
  ),
  CommunityController.rejectJoinRequest,
)

router.patch(
  '/leave',
  validate(validators.leaveCommunityValidator.http()),
  applyGuards(communityExistenceGuard),
  CommunityController.leave,
)

router.patch(
  '/kick-out',
  validate(validators.leaveCommunityValidator.http()),
  applyGuards(
    communityExistenceGuard,
    userExistenceGuard,
    inCommunityMembersGuard,
    communityAdminsGuard,
  ),
  CommunityController.leave, //TODO: Implement The kickOut Service
)

router.post(
  '/:communityId/add-admin',
  validate(validators.addAdminValidator.http()),
  applyGuards(communityExistenceGuard, communityOwnerGuard, userExistenceGuard),
  CommunityController.addAdmin,
)

router.patch(
  '/:communityId/remove-admin',
  validate(validators.removeAdminValidator.http()),
  applyGuards(communityExistenceGuard, communityOwnerGuard, userExistenceGuard),
  CommunityController.removeAdmin,
)

router.post(
  '/add-post',
  fileReader('image/jpeg', 'image/jpg', 'image/png').array('attachments', 4),
  validate(validators.addPostValidator),
  applyGuards(communityExistenceGuard, communityPublishPermissionGuard),
  communityAttachmentsUploader,
  CommunityController.addPost,
)

router.delete(
  '/:communityId/remove-post',
  validate(validators.removePostValidator.http()),
  applyGuards(
    communityExistenceGuard,
    postExistenceInCommunityGuard,
    communityPostDeletionGuard,
  ),
  CommunityController.removePost,
)

router.patch(
  '/change-cover',
  fileReader('image/jpeg', 'image/jpg', 'image/png').single('cover'),
  validate(validators.changeCoverValidator),
  applyGuards(communityExistenceGuard, communityAdminsGuard),
  CommunityController.changeCover,
)

router.patch(
  '/edit-community',
  validate(validators.editValidator.http()),
  applyGuards(communityExistenceGuard, communityAdminsGuard),
  CommunityController.editCommunity,
)

router.patch(
  '/change-visibility',
  validate(validators.changeVisibilityValidator.http()),
  applyGuards(communityExistenceGuard, communityOwnerGuard),
  CommunityController.changeVisibility,
)

router.delete(
  '/:communityId',
  validate(validators.deleteCommunityValidator.http()),
  applyGuards(communityExistenceGuard, communityOwnerGuard),
  CommunityController.deleteCommunity,
)

export default router
