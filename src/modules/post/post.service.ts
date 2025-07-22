import postRepository from '../../common/repositories/post.repository'
import userRepository from '../../common/repositories/user.repository'

import * as DTO from './dto/post.dto'

import { MongoId } from './../../common/types/db/db.types'
import { ICloudFiles } from '../../common/services/upload/interface/cloud-response.interface'
import { throwError } from '../../common/handlers/error-message.handler'
import { IUser } from '../../db/interface/IUser.interface'

export class PostService {
  private static readonly postRepository = postRepository
  private static readonly userRepository = userRepository

  static readonly getAll = async (query: DTO.IGetAll) => {
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
    createPost,
    attachments,
  }: {
    createdBy: MongoId
    createPost: DTO.ICreatePost
    attachments: ICloudFiles
  }) => {
    return await this.postRepository.create({
      ...createPost,
      ...(attachments.folderId && {
        attachments,
      }),
      createdBy,
    })
  }

  static readonly edit = async ({
    postId,
    editPost,
  }: {
    postId: MongoId
    editPost: DTO.IEditPost
  }) => {
    return await this.postRepository.findOneAndUpdate({
      filter: {
        $and: [{ _id: postId }, { archivedAt: { $exists: false } }],
      },
      data: editPost,
      options: { new: true, projection: Object.keys(editPost).join(' ') },
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
        $adSet: { savedBy: profileId },
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

  static readonly removeFromGroup = async ({
    groupId,
    postId,
  }: {
    groupId: MongoId
    postId: MongoId
  }) => {
    return await this.postRepository.findOneAndUpdate({
      filter: { $and: [{ _id: postId }, { onGroup: groupId }] },
      data: { $unset: { onGroup: 1 } },
      options: { lean: true, new: true },
    })
  }

  static readonly like = async ({
    profile,
    postId,
  }: {
    profile: IUser
    postId: string
  }) => {
    const postDoc = await this.postRepository.findByIdAndUpdate({
      _id: postId,
      data: { $addToSet: { likedBy: profile._id } },
      options: {
        lean: true,
        new: true,
        projection: { attachments: 1, createdBy: 1 },
      },
    })
  }

  static readonly unlike = async ({
    profileId,
    postId,
  }: {
    postId: string
    profileId: MongoId
  }) => {
    await this.postRepository.findByIdAndUpdate({
      _id: postId,
      data: { $pull: { likedBy: profileId } },
    })
  }
}
