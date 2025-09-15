import * as DTO from "./dto/notification.dto"

import { throwError } from "../../../common/handlers/error-message.handler"
import { MongoId } from "../../../common/types/db"
import { notificationRepository } from "../../../db/repositories"

class NotificationService {
  private readonly notificationRepository = notificationRepository

  public readonly getUserNotifications = async (profileId: MongoId) => {
    const notifications = await this.getNotifications(profileId)

    if (!notifications)
      return {
        notifications: null,
        totalNewNotifications: 0,
      }

    return notifications
  }

  private readonly getNotifications = async (profileId: MongoId) => {
    return await this.notificationRepository.findOne({
      filter: { belongsTo: profileId },
      projection: {
        missed: 1,
        seen: 1,
        newMessages: 1,
        newNotifications: 1,
      },
      populate: [
        {
          path: "newNotifications.from",
          select: {
            _id: 1,
            username: 1,
            content: 1,
            "avatar.secure_url": 1,
            "attachments.paths.secure_url": 1,
            "attachment.path.secure_url": 1,
          },
          options: { lean: true },
        },
        {
          path: "newNotifications.on",
          select: {
            _id: 1,
            content: 1,
            "avatar.secure_url": 1,
            "attachments.paths.secure_url": 1,
            "attachment.path.secure_url": 1,
          },

          options: { lean: true },
        },
      ],
      options: { lean: true },
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
