import { MongoId } from '../../common/types/db/db.types'
import { ICloudFile } from '../../common/services/upload/interface/cloud-response.interface'
import { ICreateStory } from './dto/story.dto'
import { IStory } from '../../db/interface/IStory.interface'
import { ILikedStoryNotification } from '../../db/interface/INotification.interface'
import { IUser } from '../../db/interface/IUser.interface'

import storyRepository from '../../common/repositories/story.repository'
import notificationsService from '../../common/services/notifications/notifications.service'

export class StoryService {
  private static readonly storyRepository = storyRepository
  private static readonly notificationsService = notificationsService

  static readonly getAll = async (userId: MongoId) => {
    const stories = await this.storyRepository.find({
      filter: { createdBy: userId, 'createdBy.isPrivateProfile': false },
      projection: {
        'attachment.path.secure_url': 1,
        createdBy: 1,
      },
      options: { sort: { createdAt: -1 }, lean: true },
      populate: [{ path: 'createdBy' }],
    })

    return stories
  }

  static readonly create = async ({
    createdBy,
    attachment,
  }: {
    createdBy: MongoId
    attachment: ICloudFile
    createStory: ICreateStory
  }) => {
    return await this.storyRepository.create({
      ...(attachment.folderId && {
        attachment,
      }),
      createdBy,
    })
  }

  static readonly like = async ({
    profile,
    story,
  }: {
    profile: IUser
    story: IStory
  }) => {
    const { _id: storyId, likedBy, createdBy, attachment } = story
    const { _id: profileId, username, avatar, fullName } = profile

    const isAlreadyLiked = likedBy.some(userId => userId.equals(profileId))

    if (isAlreadyLiked) {
      await this.storyRepository.findByIdAndUpdate({
        _id: storyId,
        data: { $pull: { likedBy: profileId } },
        options: {
          lean: true,
          new: true,
        },
      })
      return { msg: 'Done' }
    }

    await this.storyRepository.findByIdAndUpdate({
      _id: storyId,
      data: { $addToSet: { likedBy: profile._id } },
      options: {
        lean: true,
        new: true,
        projection: { attachments: 1, createdBy: 1 },
      },
    })

    const notification: ILikedStoryNotification = {
      title: `${username} Liked Your Story ❤️`,
      on: { _id: storyId, attachment },
      from: { _id: profileId, avatar, fullName, username },
      refTo: 'Story',
    }

    await this.notificationsService.sendNotification({
      toUser: createdBy,
      notificationDetails: notification,
    })

    return { msg: 'Story is liked successfully' }
  }

  static readonly delete = async ({
    profileId,
    storyId,
  }: {
    profileId: MongoId
    storyId: MongoId
  }) => {
    await this.storyRepository.findOneAndDelete({
      filter: {
        $and: [{ _id: storyId }, { createdBy: profileId }],
      },
    })
  }
}
