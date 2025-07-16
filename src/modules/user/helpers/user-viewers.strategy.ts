import userRepository from '../../../common/repositories/user.repository'

import { throwError } from '../../../common/handlers/error-message.handler'
import { MongoId } from '../../../common/types/db/db.types'

export class UserViewersStrategy {
  private static readonly userRepository = userRepository

  static readonly incUserProfileViewersCount = async ({
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
          { 'viewers.viewer': profileId },
          { deactivatedAt: { $exists: false } },
        ],
      },
      data: {
        $inc: { 'viewers.$.totalVisits': 1 },
      },

      options: {
        new: true,
        projection: {
          password: 0,
          oldPasswords: 0,
          phone: 0,
          'avatar.public_id': 0,
        },
        lean: true,
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

  static readonly addViewerToProfile = async ({
    profileId,
    userId,
  }: {
    profileId: MongoId
    userId: MongoId
  }) => {
    const updatedViews = await await this.userRepository.findOneAndUpdate({
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
        projection: {
          password: 0,
          oldPasswords: 0,
          phone: 0,
          'avatar.public_id': 0,
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
