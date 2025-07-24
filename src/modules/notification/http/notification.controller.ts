import { Response } from 'express'
import { successResponse } from '../../../common/handlers/http/success-response.handler'
import { IRequest } from '../../../common/interface/IRequest.interface'
import { asyncHandler } from '../../../common/decorators/async-handler/async-handler.decorator'

import { NotificationService } from '../notification.service'
import { IUser } from '../../../db/interface/IUser.interface'

export class NotificationController {
  protected static readonly NotificationService = NotificationService

  static readonly getAllNotifications = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: profileId } = req.profile
      return successResponse(res, {
        data: await this.NotificationService.getAllNotifications(profileId),
      })
    },
  )

  static readonly getNotification = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { refTo, on, from } = req.notification

      const endPoint = refTo.toLocaleLowerCase()
      const { username } = from as Pick<IUser, 'username'>

      if (refTo === 'User')
        return res.redirect(`/api/v1/${endPoint}?username=${username}`)

      return successResponse(res, { msg: 'done' })
    },
  )

  static readonly deleteNotification = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: notificationId } = req.notification
      const { _id: profileId } = req.profile

      return successResponse(res, {
        msg: 'Notification is Deleted successfully',
        data: await this.NotificationService.deleteNotification({
          id: notificationId!,
          profileId,
        }),
      })
    },
  )
}
