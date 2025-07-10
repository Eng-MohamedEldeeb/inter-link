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

class PostAuthorizationGuard extends GuardActivator {
  private readonly userRepository = userRepository
  protected profileId: MongoId | null = null

  protected readonly isAuthorized = async (createdBy: MongoId) => {
    const postOwner = await this.userRepository.findOne({
      filter: {
        $and: [{ _id: createdBy }, { deactivatedAt: { $exists: false } }],
      },
      projection: { isPrivateProfile: 1 },
    })
    if (!postOwner) return throwError({ msg: 'In-valid Post Id' })

    if (!postOwner._id.equals(this.profileId)) return false

    return true
  }

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetSinglePostDTO, IGetSinglePostDTO>()

      const { _id: profileId } = req.profile
      const { createdBy } = req.post

      this.profileId = profileId

      return await this.isAuthorized(createdBy)
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context, info } = Ctx.switchToGraphQL<IGetSinglePostDTO>()

      const { _id: profileId } = context.profile
      const { createdBy } = context.post

      this.profileId = profileId

      return await this.isAuthorized(createdBy)
    }
  }
}

export default new PostAuthorizationGuard()
