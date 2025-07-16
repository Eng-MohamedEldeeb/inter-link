import { GuardActivator } from '../can-activate.guard'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types/enum/context-type.enum'
import { MongoId } from '../../types/db/db.types'
import { IGetSinglePost } from '../../../modules/post/dto/post.dto'
import { throwError } from '../../handlers/error-message.handler'

import {
  GraphQLParams,
  HttpParams,
} from '../../decorators/context/types/context-detector.types'

import groupRepository from '../../repositories/group.repository'

class PostInGroupPermission extends GuardActivator {
  private readonly groupRepository = groupRepository
  protected createdBy!: MongoId
  protected profileId!: MongoId
  protected members!: MongoId[]
  protected admins!: MongoId[]
  protected isPrivateGroup!: boolean

  protected readonly postPermission = async () => {
    if (this.profileId.equals(this.createdBy)) return true

    const allowedToPost = this.userInGroupMembers() && !this.isPrivateGroup

    return allowedToPost
      ? true
      : throwError({
          msg: 'only members are allowed to share posts in the group',
          status: 403,
        })
  }

  protected readonly userInGroupMembers = (): boolean => {
    return this.members.map(String).includes(this.profileId.toString())
  }

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetSinglePost, IGetSinglePost>()
      const { members, admins, isPrivateGroup, createdBy } = req.group

      this.members = members
      this.admins = admins
      this.isPrivateGroup = isPrivateGroup
      this.profileId = req.profile._id
      this.createdBy = createdBy
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL<IGetSinglePost>()
      const { members, admins, isPrivateGroup, createdBy } = context.group

      this.createdBy = createdBy
      this.profileId = context.profile._id
      this.members = members
      this.admins = admins
      this.isPrivateGroup = isPrivateGroup
    }

    return this.postPermission()
  }
}

export default new PostInGroupPermission()
