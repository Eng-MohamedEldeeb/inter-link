import { MongoId } from '../../common/types/db/db.types'
import storyRepository from '../../common/repositories/story.repository'
import { ICloudFile } from '../../common/services/upload/interface/cloud-response.interface'
import { ICreateStoryDTO } from './dto/story.dto'

export class StoryService {
  private static readonly storyRepository = storyRepository

  static readonly getAll = async (profileId: MongoId) => {
    const stories = await this.storyRepository.find({
      filter: { createdBy: profileId },
      options: { sort: { createdAt: -1 } },
    })

    return stories
  }

  static readonly create = async ({
    createdBy,
    attachment,
  }: {
    createdBy: MongoId
    attachment: ICloudFile
    createStoryDTO: ICreateStoryDTO
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
}
