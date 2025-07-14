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

class CommentAuthorizationGuard extends GuardActivator {
  private readonly userRepository = userRepository
  protected profileId: MongoId | null = null
  protected createdBy: MongoId | null = null

  protected readonly isTheOwner = async () => {
    const commentOwner = await this.userRepository.findOne({
      filter: {
        $and: [{ _id: this.createdBy }, { deactivatedAt: { $exists: false } }],
      },
      projection: { isPrivateProfile: 1 },
    })
    if (!commentOwner) return throwError({ msg: 'In-valid Comment Id' })

    if (!commentOwner._id.equals(this.profileId)) return false

    return true
  }

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP()

      this.createdBy = req.comment.createdBy
      this.profileId = req.profile._id

      return await this.isTheOwner()
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL()

      this.createdBy = context.comment.createdBy
      this.profileId = context.profile._id

      return await this.isTheOwner()
    }
  }
}

export default new CommentAuthorizationGuard()
