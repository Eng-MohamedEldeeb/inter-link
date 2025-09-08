import { MongoId } from "../../types/db"
import { GuardActivator } from "../../decorators/guard/guard-activator.guard"
import { ContextDetector } from "../../decorators/context/context-detector.decorator"
import { ContextType } from "../../decorators/context/types"
import { throwError } from "../../handlers/error-message.handler"

import { GraphQLParams, HttpParams } from "../../decorators/context/types"

import userRepository from "../../repositories/concrete/user.repository"
import storyRepository from "../../repositories/concrete/story.repository"

class StoryViewPermissionGuard extends GuardActivator {
  private readonly storyRepository = storyRepository
  private readonly userRepository = userRepository
  private profileId!: MongoId
  private createdBy!: MongoId

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

    const ownerProfile = await this.userRepository.findOne({
      filter: {
        $and: [{ _id: this.createdBy }, { deactivatedAt: { $exists: false } }],
      },
      projection: { isPrivateProfile: 1 },
      options: { lean: true },
    })

    if (ownerProfile && ownerProfile.isPrivateProfile)
      return throwError({
        msg: "Story Cannot be Reached due to a Private Profile",
        status: 403,
      })

    await this.updateViewers()

    return true
  }

  private readonly updateViewers = async (): Promise<void> => {
    if (this.createdBy.equals(this.profileId)) return

    await this.storyRepository.findByIdAndUpdate({
      _id: this.createdBy,
      data: {
        $addToSet: { viewers: this.profileId },
      },
    })
  }
}

export default new StoryViewPermissionGuard()
