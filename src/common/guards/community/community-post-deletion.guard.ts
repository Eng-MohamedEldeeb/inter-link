import { GuardActivator } from "../../decorators/guard/guard-activator.guard"
import { ContextDetector } from "../../decorators/context/context-detector.decorator"
import { ContextType } from "../../decorators/context/types"

import {
  IGetCommunity,
  IRemovePost,
} from "../../../modules/community/dto/community.dto"

import { GraphQLParams, HttpParams } from "../../decorators/context/types"

import postRepository from "../../repositories/post.repository"
import { MongoId } from "../../types/db"

class CommunityPostDeletionGuard extends GuardActivator {
  private readonly postRepository = postRepository
  private admins!: MongoId[]

  private communityCreator!: MongoId
  private postCreator!: MongoId
  private profileId!: MongoId

  canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetCommunity, IRemovePost>()
      const { admins, createdBy: communityCreator } = req.community
      const { _id: profileId } = req.community
      const { createdBy: postCreator } = req.post

      this.communityCreator = communityCreator
      this.postCreator = postCreator
      this.profileId = profileId
      this.admins = admins
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL()
      const { admins, createdBy: communityCreator } = context.community
      const { _id: profileId } = context.community
      const { createdBy: postCreator } = context.post

      this.communityCreator = communityCreator
      this.postCreator = postCreator
      this.profileId = profileId
      this.admins = admins
    }

    return this.isAllowedToDelete()
  }

  private readonly isAllowedToDelete = () => {
    const isTheCreator = this.profileId.equals(this.postCreator)

    if (isTheCreator) return true

    const isTheCommunityOwner = this.profileId.equals(this.communityCreator)

    if (isTheCommunityOwner) return true

    const isCommunityAdmin = this.admins.some(adminId =>
      adminId.equals(this.profileId),
    )

    if (isCommunityAdmin) return true

    return false
  }
}

export default new CommunityPostDeletionGuard()
