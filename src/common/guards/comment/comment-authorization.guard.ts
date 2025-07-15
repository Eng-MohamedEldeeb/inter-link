import { GuardActivator } from '../can-activate.guard'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import {
  GraphQLParams,
  HttpParams,
} from '../../decorators/context/types/context-detector.types'
import { ContextType } from '../../decorators/context/types/enum/context-type.enum'

import userRepository from '../../repositories/user.repository'
import { MongoId } from '../../types/db/db.types'

import { throwError } from '../../handlers/error-message.handler'

class StoryAuthorizationGuard extends GuardActivator {
  private readonly userRepository = userRepository
  protected profileId: MongoId | null = null
  protected createdBy: MongoId | null = null

  protected readonly isTheOwner = async () => {
    const storyOwner = await this.userRepository.findOne({
      filter: {
        $and: [{ _id: this.createdBy }, { deactivatedAt: { $exists: false } }],
      },
      projection: { isPrivateProfile: 1 },
    })
    if (!storyOwner) return throwError({ msg: 'In-valid Comment Id' })

    if (!storyOwner._id.equals(this.profileId)) return false

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

export default new StoryAuthorizationGuard()
