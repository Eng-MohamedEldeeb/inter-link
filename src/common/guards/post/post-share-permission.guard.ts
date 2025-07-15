import { GuardActivator } from '../can-activate.guard'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types/enum/context-type.enum'
import {
  GraphQLParams,
  HttpParams,
} from '../../decorators/context/types/context-detector.types'

import userRepository from '../../repositories/user.repository'
import { MongoId } from '../../types/db/db.types'
import { IGetSinglePost } from '../../../modules/post/dto/post.dto'

import { throwError } from '../../handlers/error-message.handler'

class PostSharePermission extends GuardActivator {
  private readonly userRepository = userRepository
  protected profileId!: MongoId
  protected createdBy!: MongoId

  protected readonly sharePermission = async () => {
    const postOwner = await this.userRepository.findOne({
      filter: {
        $and: [{ _id: this.createdBy }, { deactivatedAt: { $exists: false } }],
      },
      projection: { isPrivateProfile: 1 },
    })

    if (!postOwner) return throwError({ msg: 'In-valid Post Id' })

    if (postOwner.isPrivateProfile && !postOwner._id.equals(this.profileId))
      return throwError({
        msg: 'Only Private Profiles can share their own posts ',
        status: 403,
      })

    return true
  }

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetSinglePost, IGetSinglePost>()

      this.createdBy = req.post.createdBy
      this.profileId = req.profile._id
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL<IGetSinglePost>()

      this.createdBy = context.post.createdBy
      this.profileId = context.profile._id
    }

    return await this.sharePermission()
  }
}

export default new PostSharePermission()
