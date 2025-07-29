import { GuardActivator } from '../class/guard-activator.class'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types'
import { MongoId } from '../../types/db'
import { IGetSinglePost } from '../../../modules/post/dto/post.dto'
import { throwError } from '../../handlers/error-message.handler'

import { GraphQLParams, HttpParams } from '../../decorators/context/types'

import userRepository from '../../repositories/user.repository'

class PostSharePermissionGuard extends GuardActivator {
  protected readonly userRepository = userRepository
  protected profileId!: MongoId
  protected createdBy!: MongoId

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

    return await this.allowedToShare()
  }

  protected readonly allowedToShare = async () => {
    const ownerProfile = await this.userRepository.findOne({
      filter: {
        $and: [{ _id: this.createdBy }, { deactivatedAt: { $exists: false } }],
      },
      projection: { isPrivateProfile: 1 },
    })

    if (!ownerProfile) return throwError({ msg: 'In-valid Post Id' })

    if (
      ownerProfile.isPrivateProfile &&
      !ownerProfile._id.equals(this.profileId)
    )
      return throwError({
        msg: 'Only Followers can share their own posts of this Private Profile',
        status: 403,
      })

    return true
  }
}

export default new PostSharePermissionGuard()
