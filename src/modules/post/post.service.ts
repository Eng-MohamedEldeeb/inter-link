import postRepository from '../../common/repositories/post.repository'
import { ICreatePostDTO, IEditPostDTO, IGetAllDTO } from './dto/post.dto'
import { ICloud } from '../../common/services/upload/interface/cloud-response.interface'
import { MongoObjId } from '../../common/types/db/mongo.types'
import { throwError } from '../../common/handlers/error-message.handler'
import { IPost } from '../../db/interface/IPost.interface'

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

  static readonly getSingle = (post: IPost) => {
    return post
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
    postId: MongoObjId,
    editPostDTO: IEditPostDTO,
  ) => {
    return await this.postRepository.findOneAndUpdate({
      filter: {
        $and: [{ _id: postId }, { archivedAt: { $exists: false } }],
      },
      data: editPostDTO,
      options: { new: true, projection: Object.keys(editPostDTO).join(' ') },
    })
  }

  static readonly archive = async (postId: MongoObjId) => {
    return await this.postRepository.findOneAndUpdate({
      filter: {
        $and: [{ _id: postId }, { archivedAt: { $exists: false } }],
      },
      data: { archivedAt: Date.now() },
      options: { new: true, projection: 'archivedAt' },
    })
  }

  static readonly restore = async (postId: MongoObjId) => {
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
          msg: 'In-Existent Post or In-valid Id',
          status: 404,
        })
  }

  static readonly delete = async (postId: MongoObjId) => {
    const isDeleted = await this.postRepository.findOneAndDelete({
      filter: {
        $and: [{ _id: postId }],
      },
    })
    return isDeleted
      ? isDeleted
      : throwError({
          msg: 'In-Existent Post or In-valid Id',
          status: 404,
        })
  }
}
