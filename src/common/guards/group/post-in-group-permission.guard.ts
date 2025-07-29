import { GuardActivator } from '../class/guard-activator.class'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types'
import { MongoId } from '../../types/db'
import { IGetSinglePost } from '../../../modules/post/dto/post.dto'
import { throwError } from '../../handlers/error-message.handler'

import { GraphQLParams, HttpParams } from '../../decorators/context/types'

class PostInGroupPermissionGuard extends GuardActivator {
  protected createdBy!: MongoId
  protected profileId!: MongoId
  protected members!: MongoId[]
  protected admins!: MongoId[]
  protected isPrivateGroup!: boolean

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetSinglePost, IGetSinglePost>()

      const { members, admins, isPrivateGroup, createdBy } = req.group
      const { _id: profileId } = req.profile

      this.members = members
      this.admins = admins
      this.isPrivateGroup = isPrivateGroup
      this.profileId = profileId
      this.createdBy = createdBy
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL<IGetSinglePost>()

      const { members, admins, isPrivateGroup, createdBy } = context.group
      const { _id: profileId } = context.profile

      this.createdBy = createdBy
      this.profileId = profileId
      this.members = members
      this.admins = admins
      this.isPrivateGroup = isPrivateGroup
    }

    if (this.isPrivateGroup)
      return throwError({
        msg: 'only members are allowed to share posts in this private group',
        status: 403,
      })

    return this.publishPermission()
  }

  protected readonly publishPermission = async () => {
    if (this.profileId.equals(this.createdBy)) return true

    if (!this.userInGroupMembers() || !this.userInGroupAdmins())
      return throwError({
        msg: 'only members are allowed to share posts in the group',
        status: 403,
      })

    return true
  }

  protected readonly userInGroupMembers = (): boolean => {
    return this.members.some((memberId: MongoId) =>
      memberId.equals(this.profileId),
    )
  }

  protected readonly userInGroupAdmins = (): boolean => {
    return this.admins.some((adminId: MongoId) =>
      adminId.equals(this.profileId),
    )
  }
}

export default new PostInGroupPermissionGuard()
