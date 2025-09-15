import { GuardActivator } from "../../decorators/guard/guard-activator.guard"
import { ContextDetector } from "../../decorators/context/context-detector.decorator"
import { ContextType } from "../../decorators/context/types"
import { MongoId } from "../../types/db"
import { IGetSinglePost } from "../../../modules/apis/post/dto/post.dto"
import { throwError } from "../../handlers/error-message.handler"

import { GraphQLParams, HttpParams } from "../../decorators/context/types"

import inCommunityAdminsGuard from "./in-community-admins.guard"
import inCommunityMembersGuard from "./in-community-members.guard"

class CommunityPublishPermissionGuard extends GuardActivator {
  private createdBy!: MongoId
  private profileId!: MongoId
  private members!: MongoId[]
  private admins!: MongoId[]
  private isPrivateCommunity!: boolean
  private params!: HttpParams | GraphQLParams

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)
    this.params = params

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetSinglePost, IGetSinglePost>()

      const { members, admins, isPrivateCommunity, createdBy } = req.community
      const { _id: profileId } = req.profile

      this.members = members
      this.admins = admins
      this.isPrivateCommunity = isPrivateCommunity
      this.profileId = profileId
      this.createdBy = createdBy
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL<IGetSinglePost>()

      const { members, admins, isPrivateCommunity, createdBy } =
        context.community
      const { _id: profileId } = context.profile

      this.createdBy = createdBy
      this.profileId = profileId
      this.members = members
      this.admins = admins
      this.isPrivateCommunity = isPrivateCommunity
    }

    return this.publishPermission()
  }

  private readonly publishPermission = async () => {
    if (this.profileId.equals(this.createdBy)) return true

    if (
      !inCommunityAdminsGuard.canActivate(...this.params) &&
      !inCommunityMembersGuard.canActivate(...this.params)
    )
      return throwError({
        msg: "only members are allowed to share posts in the community",
        status: 403,
      })

    return true
  }
}

export default new CommunityPublishPermissionGuard()
