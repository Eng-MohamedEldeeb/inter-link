import { throwError } from "../../../../common/handlers/error-message.handler"
import { userRepository } from "../../../../db/repositories"
import { MongoId } from "../../../../common/types/db"

export class UserViewersStrategy {
  private static readonly userRepository = userRepository

  public static readonly incUserProfileViewersCount = async ({
    profileId,
    userId,
  }: {
    profileId: MongoId
    userId: MongoId
  }) => {
    const updatedViews = await this.userRepository.findOneAndUpdate({
      filter: {
        $and: [
          { _id: userId },
          { "viewers.viewer": profileId },
          { deactivatedAt: { $exists: false } },
        ],
      },
      data: {
        $inc: { "viewers.$.totalVisits": 1 },
      },
    })

    return (
      updatedViews ??
      throwError({
        msg: "user doesn't exist",
        status: 400,
      })
    )
  }

  public static readonly addViewerToProfile = async ({
    profileId,
    userId,
  }: {
    profileId: MongoId
    userId: MongoId
  }) => {
    const updatedViews = await this.userRepository.findOneAndUpdate({
      filter: {
        $and: [{ _id: userId }, { deactivatedAt: { $exists: false } }],
      },
      data: {
        $push: {
          viewers: {
            viewer: profileId,
            totalVisits: 1,
          },
        },
      },
    })

    return (
      updatedViews ??
      throwError({
        msg: "user doesn't exist",
        status: 400,
      })
    )
  }
}
