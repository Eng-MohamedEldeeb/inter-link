import storyRepository from "../../common/repositories/story.repository"
import notifyService from "../../common/services/notify/notify.service"

import { MongoId } from "../../common/types/db"
import { ICloudFile } from "../../common/services/upload/interface/cloud-response.interface"
import { ICreateStory } from "./dto/story.dto"
import { IStory } from "../../db/interfaces/IStory.interface"
import { ILikedStoryNotification } from "../../db/interfaces/INotification.interface"
import { IUser } from "../../db/interfaces/IUser.interface"
import { getNowMoment } from "../../common/decorators/moment/moment"

class StoryService {
  protected readonly storyRepository = storyRepository
  protected readonly notifyService = notifyService

  public readonly getAll = async (userId: MongoId) => {
    const stories = await this.storyRepository.find({
      filter: { createdBy: userId, "createdBy.isPrivateProfile": false },
      projection: {
        "attachment.path.secure_url": 1,
        createdBy: 1,
      },
      options: { sort: { createdAt: -1 }, lean: true },
      populate: [{ path: "createdBy" }],
    })

    return stories
  }

  public readonly create = async ({
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

  public readonly like = async ({
    profile,
    story,
  }: {
    profile: IUser
    story: IStory
  }) => {
    const { _id: storyId, likedBy, createdBy, attachment } = story
    const { _id: profileId, username, avatar } = profile

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
      return { msg: "Done" }
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
      message: `${username} Liked Your Story ❤️`,
      on: { _id: storyId, attachment },
      from: { _id: profileId, avatar, username },
      refTo: "Story",
      sentAt: getNowMoment(),
    }

    this.notifyService.sendNotification({
      userId: createdBy,
      notificationDetails: notification,
    })

    return { msg: "Story is liked successfully" }
  }

  public readonly delete = async ({
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

export default new StoryService()
