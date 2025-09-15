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

      options: {
        new: true,
        populate: [{ path: "posts" }],
        projection: {
          phone: 0,
          password: 0,
          oldPasswords: 0,
          "avatar.public_id": 0,
          "avatar.folderPath": 0,
          blockedUsers: 0,
          savedPosts: 0,
          requests: 0,
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
      options: {
        new: true,
        populate: [{ path: "posts" }],
        projection: {
          phone: 0,
          password: 0,
          oldPasswords: 0,
          "avatar.public_id": 0,
          "avatar.folderPath": 0,
          blockedUsers: 0,
          savedPosts: 0,
          requests: 0,
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
