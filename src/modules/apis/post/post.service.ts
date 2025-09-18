import { postRepository, userRepository } from "../../../db/repositories"

import * as DTO from "./dto/post.dto"

import { MongoId } from "../../../common/types/db"
import { ICloudFiles } from "../../../common/services/upload/interface/cloud-response.interface"
import { throwError } from "../../../common/handlers/error-message.handler"
import { IUser } from "../../../db/interfaces/IUser.interface"
import { IPost } from "../../../db/interfaces/IPost.interface"
import { currentMoment } from "../../../common/decorators/moment/moment"
import { Notify } from "../../../common/services/notify/notify.event"
import { NotificationRefTo } from "../../../db/interfaces/INotification.interface"

class PostService {
  private readonly postRepository = postRepository
  private readonly userRepository = userRepository
  private readonly Notify = Notify

  public readonly getAll = async (query: DTO.IGetAll) => {
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

  public readonly create = async ({
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

  public readonly edit = async ({
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
      options: { new: true, projection: Object.keys(editPost).join(" ") },
    })
  }

  public readonly save = async ({
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

  public readonly shared = async (postId: MongoId) => {
    await this.postRepository.findOneAndUpdate({
      filter: {
        $and: [{ _id: postId }, { archivedAt: { $exists: false } }],
      },
      data: {
        $inc: { shares: 1 },
      },
    })
  }

  public readonly archive = async (postId: MongoId) => {
    return await this.postRepository.findOneAndUpdate({
      filter: {
        $and: [{ _id: postId }, { archivedAt: { $exists: false } }],
      },
      data: { archivedAt: Date.now() },
      options: { new: true, projection: "archivedAt" },
    })
  }

  public readonly restore = async (postId: MongoId) => {
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
          msg: "Un-Existed Post or Invalid Id",
          status: 404,
        })
  }

  public readonly delete = async ({
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

  public readonly removeFromCommunity = async ({
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

  public readonly like = async ({
    profile,
    post,
  }: {
    profile: IUser
    post: IPost
  }) => {
    const { _id: postId, likedBy, createdBy, attachments } = post
    const { _id: profileId, username, avatar } = profile

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
      return { msg: "Done" }
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

    this.Notify.sendNotification({
      sender: profile,
      receiverId: createdBy,
      body: {
        message: `${profile.username} liked your post 🩵`,
        sentAt: currentMoment(),
        refTo: NotificationRefTo.Post,
        relatedTo: postId,
      },
    })

    return { msg: "Post is liked successfully" }
  }

  public readonly unlike = async ({
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

export default new PostService()
