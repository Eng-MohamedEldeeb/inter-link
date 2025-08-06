import moment from 'moment'
import postRepository from '../../common/repositories/post.repository'
import userRepository from '../../common/repositories/user.repository'
import notificationsService from '../../common/services/notifications/notifications.service'

import * as DTO from './dto/post.dto'

import { MongoId } from '../../common/types/db'
import { ICloudFiles } from '../../common/services/upload/interface/cloud-response.interface'
import { throwError } from '../../common/handlers/error-message.handler'
import { IUser } from '../../db/interfaces/IUser.interface'
import { IPost } from '../../db/interfaces/IPost.interface'
import { ILikedPostNotification } from '../../db/interfaces/INotification.interface'

export class PostService {
  protected static readonly postRepository = postRepository
  protected static readonly userRepository = userRepository
  protected static readonly notificationsService = notificationsService

  public static readonly getAll = async (query: DTO.IGetAll) => {
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

  public static readonly create = async ({
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

  public static readonly edit = async ({
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

  public static readonly save = async ({
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

  public static readonly shared = async (postId: MongoId) => {
    await this.postRepository.findOneAndUpdate({
      filter: {
        $and: [{ _id: postId }, { archivedAt: { $exists: false } }],
      },
      data: {
        $inc: { shares: 1 },
      },
    })
  }

  public static readonly archive = async (postId: MongoId) => {
    return await this.postRepository.findOneAndUpdate({
      filter: {
        $and: [{ _id: postId }, { archivedAt: { $exists: false } }],
      },
      data: { archivedAt: Date.now() },
      options: { new: true, projection: 'archivedAt' },
    })
  }

  public static readonly restore = async (postId: MongoId) => {
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

  public static readonly delete = async ({
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

  public static readonly removeFromCommunity = async ({
    communityId,
    postId,
  }: {
    communityId: MongoId
    postId: MongoId
  }) => {
    return await this.postRepository.findOneAndUpdate({
      filter: { $and: [{ _id: postId }, { onCommunity: communityId }] },
      data: { $unset: { onCommunity: 1 } },
      options: { lean: true, new: true },
    })
  }

  public static readonly like = async ({
    profile,
    post,
  }: {
    profile: IUser
    post: IPost
  }) => {
    const { _id: postId, likedBy, createdBy, attachments } = post
    const { _id: profileId, username, avatar, fullName } = profile

    const isAlreadyLiked = likedBy.some(userId => userId.equals(profileId))

    if (isAlreadyLiked) {
      await this.postRepository.findByIdAndUpdate({
        _id: postId,
        data: { $pull: { likedBy: profileId } },
        options: {
          lean: true,
          new: true,
        },
      })
      return { msg: 'Done' }
    }

    await this.postRepository.findByIdAndUpdate({
      _id: postId,
      data: { $addToSet: { likedBy: profileId } },
      options: {
        lean: true,
        new: true,
        projection: { attachments: 1, createdBy: 1 },
      },
    })

    const notification: ILikedPostNotification = {
      notificationMessage: `${username} Liked Your Post ❤️`,
      on: { _id: postId, attachments },
      from: { _id: profileId, avatar, fullName, username },
      refTo: 'Post',
      sentAt: moment().format('h:mm A'),
    }

    await this.notificationsService.sendNotification({
      userId: createdBy,
      notificationDetails: notification,
    })

    return { msg: 'Post is liked successfully' }
  }

  public static readonly unlike = async ({
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
