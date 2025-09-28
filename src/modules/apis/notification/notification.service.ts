import * as DTO from "./dto/notification.dto"

import { throwError } from "../../../common/handlers/error-message.handler"
import { notificationRepository } from "../../../db/repositories"
import { IComment } from "../../../db/interfaces/IComment.interface"
import { IPost } from "../../../db/interfaces/IPost.interface"
import { MongoId } from "../../../common/types/db"
import {
  INotificationInputs,
  NotificationStatus,
} from "../../../db/interfaces/INotification.interface"
import { QueryOptions, RootFilterQuery } from "mongoose"

class NotificationService {
  private readonly notificationRepository = notificationRepository

  public readonly getUserNotifications = async (
    profileId: MongoId,
    opt?: { status?: NotificationStatus; sorted?: boolean },
  ) => {
    let filter: RootFilterQuery<INotificationInputs>
    let options: QueryOptions<INotificationInputs>

    if (opt?.status)
      filter = { $and: [{ receiver: profileId, status: opt.status }] }
    else filter = { receiver: profileId }

    if (opt?.sorted)
      options = {
        sort: {
          sentAt: -1,
        },
      }
    else options = {}

    return await this.notificationRepository.find({
      filter: filter,
      options,
      projection: {
        sender: 1,
        sentAt: 1,
        interactionType: 1,
        onComment: 1,
        onPost: 1,
      },

      populate: [
        {
          path: "sender",
          select: {
            username: 1,
            "avatar.secure_url": 1,
          },

          options: { lean: true },
        },

        {
          path: "followedBy",
          select: {
            username: 1,
            "avatar.secure_url": 1,
          },

          options: { lean: true },
        },
        {
          path: "onPost",
          select: <Record<keyof IPost, number>>{
            attachments: 1,
            title: 1,
            body: 1,
          },
          options: { lean: true },
        },
        {
          path: "onComment",
          select: <Record<keyof IComment, number>>{
            attachment: 1,
            body: 1,
          },
          options: { lean: true },
        },
        {
          path: "repliedWith",
          select: <Record<keyof IComment, number>>{
            attachment: 1,
            body: 1,
          },
          options: { lean: true },
        },
      ],
    })
  }

  public readonly deleteNotification = async ({
    profileId,
    id,
  }: DTO.IDeleteNotifications) => {
    const isDeleted = await this.notificationRepository.findOneAndUpdate({
      filter: {
        receiver: profileId,
      },
      data: { deletedAt: Date.now() },
    })

    return (
      isDeleted ??
      throwError({
        msg: "Invalid Notification id or Notification doesn't exist",
        status: 404,
      })
    )
  }
}

export default new NotificationService()
