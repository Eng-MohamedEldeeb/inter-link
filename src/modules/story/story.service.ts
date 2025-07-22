import storyRepository from '../../common/repositories/story.repository'

import { MongoId } from '../../common/types/db/db.types'
import { ICloudFile } from '../../common/services/upload/interface/cloud-response.interface'
import { ICreateStory } from './dto/story.dto'
import { TNotificationDetails } from '../../db/types/notification.type'
import { IUser } from '../../db/interface/IUser.interface'
import onlineUsersController from '../../common/services/notifications/online-users.controller'

export class StoryService {
  private static readonly storyRepository = storyRepository
  private static readonly onlineUsersController = onlineUsersController

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

  static readonly like = async ({
    profile,
    storyId,
  }: {
    profile: IUser
    storyId: string
  }) => {
    const storyDoc = await this.storyRepository.findByIdAndUpdate({
      _id: storyId,
      data: { $addToSet: { likedBy: profile._id } },
      options: { lean: true, new: true, projection: { createdBy: 1 } },
    })

    // const id = this.onlineUsersController .get(storyDoc!.createdBy)
  }

  static readonly unlike = async ({
    profileId,
    storyId,
  }: {
    storyId: string
    profileId: MongoId
  }) => {
    await this.storyRepository.findByIdAndUpdate({
      _id: storyId,
      data: { $pull: { likedBy: profileId } },
    })
  }
}
