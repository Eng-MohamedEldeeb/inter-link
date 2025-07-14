import { MongoId } from './../../common/types/db/db.types'
import postRepository from '../../common/repositories/post.repository'
import userRepository from '../../common/repositories/user.repository'
import { ICreatePostDTO, IEditPostDTO, IGetAllDTO } from './dto/post.dto'
import { ICloudFiles } from '../../common/services/upload/interface/cloud-response.interface'
import { throwError } from '../../common/handlers/error-message.handler'

export class PostService {
  private static readonly postRepository = postRepository
  private static readonly userRepository = userRepository

  static readonly getAll = async (query: IGetAllDTO) => {
    const { page, limit } = query

    const skip = (page ?? 1 - 1) * limit

    const limitQuery = limit ?? 10

    const posts = await this.postRepository.find({
      filter: { archivedAt: { $exists: false } },
      options: { sort: { createdAt: -1 }, projection: { saves: 0 } },
      skip,
      limit: limitQuery,
    })

    return {
      posts,
      count: posts.length,
      page: Math.ceil(posts.length / limitQuery),
    }
  }

  static readonly create = async ({
    createdBy,
    createPostDTO,
  }: {
    createdBy: MongoId
    createPostDTO: {
      data: ICreatePostDTO
      attachments: ICloudFiles
    }
  }) => {
    return await this.postRepository.create({
      ...createPostDTO.data,
      ...(createPostDTO.attachments.folderId && {
        attachments: createPostDTO.attachments,
      }),
      createdBy,
    })
  }

  static readonly edit = async ({
    postId,
    editPostDTO,
  }: {
    postId: MongoId
    editPostDTO: IEditPostDTO
  }) => {
    return await this.postRepository.findOneAndUpdate({
      filter: {
        $and: [{ _id: postId }, { archivedAt: { $exists: false } }],
      },
      data: editPostDTO,
      options: { new: true, projection: Object.keys(editPostDTO).join(' ') },
    })
  }

  static readonly save = async ({
    profileId,
    postId,
  }: {
    profileId: MongoId
    postId: MongoId
  }) => {
    await this.postRepository.findOneAndUpdate({
      filter: {
        $and: [
          { _id: postId },
          { archivedAt: { $exists: false } },
          { savedBy: { $ne: profileId } },
        ],
      },
      data: {
        $addToSet: { savedBy: profileId },
        $inc: { totalSaves: 1 },
      },
    })
  }

  static readonly shared = async (postId: MongoId) => {
    await this.postRepository.findOneAndUpdate({
      filter: {
        $and: [{ _id: postId }, { archivedAt: { $exists: false } }],
      },
      data: {
        $inc: { shares: 1 },
      },
    })
  }

  static readonly archive = async (postId: MongoId) => {
    return await this.postRepository.findOneAndUpdate({
      filter: {
        $and: [{ _id: postId }, { archivedAt: { $exists: false } }],
      },
      data: { archivedAt: Date.now() },
      options: { new: true, projection: 'archivedAt' },
    })
  }

  static readonly restore = async (postId: MongoId) => {
    const isRestored = await this.postRepository.findOneAndUpdate({
      filter: {
        $and: [{ _id: postId }, { archivedAt: { $exists: true } }],
      },
      data: {
        $unset: {
          archivedAt: 1,
        },
      },
    })
    return isRestored
      ? isRestored
      : throwError({
          msg: 'Un-Existed Post or In-valid Id',
          status: 404,
        })
  }

  static readonly delete = async ({
    profileId,
    postId,
  }: {
    profileId: MongoId
    postId: MongoId
  }) => {
    await this.userRepository.findOneAndUpdate({
      filter: {
        _id: profileId,
      },
      data: { $pull: { savedPosts: postId } },
    })

    await this.postRepository.findOneAndDelete({
      filter: {
        $and: [{ _id: postId }],
      },
    })
  }
}
