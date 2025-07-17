import { MongoId } from './../../types/db/db.types'
import { GuardActivator } from '../can-activate.guard'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types/enum/context-type.enum'
import { throwError } from '../../handlers/error-message.handler'

import {
  GraphQLParams,
  HttpParams,
} from '../../decorators/context/types/context-detector.types'

import userRepository from '../../repositories/user.repository'
import storyRepository from '../../repositories/story.repository'

class StoryViewPermissionGuard extends GuardActivator {
  private readonly storyRepository = storyRepository
  private readonly userRepository = userRepository
  protected profileId!: MongoId
  protected createdBy!: MongoId

  protected readonly updateViewers = async (): Promise<void> => {
    if (this.createdBy.equals(this.profileId)) return

    await this.storyRepository.findByIdAndUpdate({
      _id: this.createdBy,
      data: {
        $addToSet: { viewers: this.profileId },
      },
    })
  }

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP()
      this.createdBy = req.story.createdBy
      this.profileId = req.profile._id
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL()
      this.createdBy = context.story.createdBy
      this.profileId = context.profile._id
    }

    const checkPrivacy = await this.userRepository.findOne({
      filter: {
        $and: [{ _id: this.createdBy }, { deactivatedAt: { $exists: false } }],
      },
      projection: { isPrivateProfile: 1 },
      options: { lean: true },
    })

    if (checkPrivacy && checkPrivacy.isPrivateProfile)
      return throwError({
        msg: 'Story Cannot be Reached due to a Private Profile',
        status: 403,
      })

    await this.updateViewers()

    return true
  }
}

export default new StoryViewPermissionGuard()
