import { Response } from "express"
import { successResponse } from "../../../common/handlers/success-response.handler"
import { IRequest } from "../../../common/interface/IRequest.interface"
import { asyncHandler } from "../../../common/decorators/async-handler/async-handler.decorator"
import { IUser } from "../../../db/interfaces/IUser.interface"

import notificationService from "../notification.service"

class NotificationController {
  protected readonly notificationService = notificationService

  public readonly getAllNotifications = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: profileId } = req.profile
      return successResponse(res, {
        data: await this.notificationService.getAllNotifications(profileId),
      })
    },
  )

  public readonly getNotification = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { refTo, on, from } = req.notification

      const endPoint = refTo.toLocaleLowerCase()
      const { username } = from as IUser

      if (refTo === "User")
        return res.redirect(`/api/v1/${endPoint}?username=${username}`)

      if (on) return res.redirect(`/api/v1/${endPoint}/${on._id}`)
    },
  )

  public readonly deleteNotification = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: notificationId } = req.notification
      const { _id: profileId } = req.profile

      return successResponse(res, {
        msg: "Notification is Deleted successfully",
        data: await this.notificationService.deleteNotification({
          id: notificationId!,
          profileId,
        }),
      })
    },
  )
}

export default new NotificationController()
