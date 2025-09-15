import { Response } from "express"
import { successResponse } from "../../../../common/handlers/success-response.handler"
import { IRequest } from "../../../../common/interface/IRequest.interface"
import { asyncHandler } from "../../../../common/decorators/async-handler/async-handler.decorator"
import { IUser } from "../../../../db/interfaces/IUser.interface"

import notificationService from "../notification.service"

class NotificationController {
  private readonly notificationService = notificationService

  public readonly getUserNotifications = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: profileId } = req.profile
      return successResponse(res, {
        data: await this.notificationService.getUserNotifications(profileId),
      })
    },
  )

  public readonly getNotification = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { ref, relatedTo, sender } = req.notification

      const endPoint = ref.toLocaleLowerCase()

      if (ref === "User")
        return res.redirect(`/v1/api/${endPoint}?user_id=${sender}`)

      if (relatedTo) return res.redirect(`/v1/api/${endPoint}/${relatedTo}`)
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
