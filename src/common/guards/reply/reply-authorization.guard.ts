import { GuardActivator } from '../can-activate.guard'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types/enum/context-type.enum'
import {
  GraphQLParams,
  HttpParams,
} from '../../decorators/context/types/context-detector.types'

import userRepository from '../../repositories/user.repository'
import { MongoId } from '../../types/db/db.types'

import { throwError } from '../../handlers/error-message.handler'

class ReplyAuthorizationGuard extends GuardActivator {
  private readonly userRepository = userRepository
  protected profileId: MongoId | null = null
  protected createdBy: MongoId | null = null

  protected readonly isTheOwner = async () => {
    const replyOwner = await this.userRepository.findOne({
      filter: {
        $and: [{ _id: this.createdBy }, { deactivatedAt: { $exists: false } }],
      },
      projection: { isPrivateProfile: 1 },
    })
    if (!replyOwner) return throwError({ msg: 'In-valid Reply Id' })

    if (!replyOwner._id.equals(this.profileId)) return false

    return true
  }

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP()

      this.createdBy = req.reply.createdBy
      this.profileId = req.profile._id

      return await this.isTheOwner()
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL()

      this.createdBy = context.post.createdBy
      this.profileId = context.profile._id

      return await this.isTheOwner()
    }
  }
}

export default new ReplyAuthorizationGuard()
