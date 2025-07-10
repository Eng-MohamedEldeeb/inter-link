import { IGetSinglePostDTO } from '../../../modules/post/dto/post.dto'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import {
  GraphQLParams,
  HttpParams,
} from '../../decorators/context/types/context-detector.types'
import { ContextType } from '../../decorators/context/types/enum/context-type.enum'
import { throwError } from '../../handlers/error-message.handler'
import userRepository from '../../repositories/user.repository'
import { MongoId } from '../../types/db/db.types'
import { GuardActivator } from '../can-activate.guard'

class PostSharePermission extends GuardActivator {
  private readonly userRepository = userRepository
  protected profileId: MongoId | null = null

  protected readonly sharePermission = async (ownerId: MongoId) => {
    const postOwner = await this.userRepository.findOne({
      filter: {
        $and: [{ _id: ownerId }, { deactivatedAt: { $exists: false } }],
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
      const { req } = Ctx.switchToHTTP<IGetSinglePostDTO, IGetSinglePostDTO>()

      const { _id: profileId } = req.profile
      const { createdBy } = req.post

      this.profileId = profileId

      return await this.sharePermission(createdBy)
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context, info } = Ctx.switchToGraphQL<IGetSinglePostDTO>()

      const { _id: profileId } = context.profile
      const { createdBy } = context.post

      this.profileId = profileId

      return await this.sharePermission(createdBy)
    }
  }
}

export default new PostSharePermission()
