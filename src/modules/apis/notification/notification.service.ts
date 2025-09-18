import { QueryOptions, RootFilterQuery } from "mongoose"

import * as DTO from "./dto/notification.dto"

import { throwError } from "../../../common/handlers/error-message.handler"
import { MongoId } from "../../../common/types/db"
import { notificationRepository } from "../../../db/repositories"
import {
  INotificationInputs,
  NotificationStatus,
} from "../../../db/interfaces/INotification.interface"

import { Notify } from "../../../common/services/notify/notify.event"

class NotificationService {
  private readonly notificationRepository = notificationRepository

  public readonly getUserNotifications = async (
    profileId: MongoId,
    options?: { status?: NotificationStatus; sorted?: boolean },
  ) => {
    const notifications = await this.getNotifications(profileId, {
      status: options?.status,
      sorted: options?.sorted,
    })

    if (notifications.length > 0) Notify.markAsReadNotifications(profileId)

    return notifications
  }

  private readonly getNotifications = async (
    profileId: MongoId,
    {
      status,
      sorted,
    }: {
      status?: NotificationStatus
      sorted?: boolean
    },
  ) => {
    let filter: RootFilterQuery<INotificationInputs>
    let options: QueryOptions<INotificationInputs>

    if (status) filter = { $and: [{ receiver: profileId, status }] }
    else filter = { receiver: profileId }

    if (sorted)
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
        message: 1,
        sender: 1,
        relatedTo: 1,
        sentAt: 1,
        ref: 1,
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
          path: "relatedTo",
          select: {
            "attachments.paths.secure_url": 1,
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
        belongsTo: profileId,
      },
      data: { $pull: { seen: id, missed: id } },
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
