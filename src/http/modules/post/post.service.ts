import postRepository from '../../../common/repositories/post.repository'
import { ICreatePostDTO, IEditPostDTO, IGetAllDTO } from './dto/post.dto'
import { ICloud } from '../../../common/services/upload/interface/cloud-response.interface'
import { MongoObjId } from '../../../common/types/mongo.types'
import { throwHttpError } from '../../../common/handlers/http/error-message.handler'

export class PostService {
  private static readonly postRepository = postRepository

  static readonly getAll = async (query: IGetAllDTO) => {
    const { page, limit } = query

    const skip = (page ?? 1 - 1) * limit

    const limitQuery = limit ?? 10

    const posts = await this.postRepository.find({
      filter: { archivedAt: { $exists: false } },
      options: { sort: { createdAt: -1 } },
      skip,
      limit: limitQuery,
    })

    return {
      posts,
      count: posts.length,
      page: Math.ceil(posts.length / limitQuery),
    }
  }

  static readonly create = async (
    createdBy: MongoObjId,
    createPostDTO: ICreatePostDTO,
    attachments: ICloud[],
  ) => {
    return await this.postRepository.create({
      ...createPostDTO,
      createdBy,
      attachments,
    })
  }

  static readonly edit = async (
    createdBy: MongoObjId,
    postId: MongoObjId,
    editPostDTO: IEditPostDTO,
  ) => {
    return await this.postRepository.findOneAndUpdate({
      filter: {
        $and: [
          { _id: postId },
          { createdBy },
          { archivedAt: { $exists: false } },
        ],
      },
      data: editPostDTO,
      options: { new: true, projection: Object.keys(editPostDTO).join(' ') },
    })
  }

  static readonly archive = async (
    createdBy: MongoObjId,
    postId: MongoObjId,
  ) => {
    return await this.postRepository.findOneAndUpdate({
      filter: {
        $and: [
          { _id: postId },
          { createdBy },
          { archivedAt: { $exists: false } },
        ],
      },
      data: { archivedAt: Date.now() },
      options: { new: true, projection: 'archivedAt' },
    })
  }

  static readonly restore = async (
    createdBy: MongoObjId,
    postId: MongoObjId,
  ) => {
    const isRestored = await this.postRepository.findOneAndUpdate({
      filter: {
        $and: [
          { _id: postId },
          { createdBy },
          { archivedAt: { $exists: true } },
        ],
      },
      data: {
        $unset: {
          archivedAt: 1,
        },
      },
    })
    return isRestored
      ? isRestored
      : throwHttpError({
          msg: 'In-Existent Post or In-valid Id',
          status: 404,
        })
  }

  static readonly delete = async (
    createdBy: MongoObjId,
    postId: MongoObjId,
  ) => {
    const isDeleted = await this.postRepository.findOneAndDelete({
      filter: {
        $and: [{ _id: postId }, { createdBy }],
      },
    })
    return isDeleted
      ? isDeleted
      : throwHttpError({
          msg: 'In-Existent Post or In-valid Id',
          status: 404,
        })
  }
}
