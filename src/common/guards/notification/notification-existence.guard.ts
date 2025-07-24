import { INotificationDetails } from './../../../db/interface/INotification.interface'
import { IGetNotification } from '../../../modules/notification/dto/notification.dto'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types/enum/context-type.enum'
import { throwError } from '../../handlers/error-message.handler'
import { MongoId } from '../../types/db/db.types'

import {
  GraphQLParams,
  HttpParams,
} from '../../decorators/context/types/context-detector.types'

import notificationRepository from '../../repositories/notification.repository'

class NotificationExistence {
  protected readonly notificationRepository = notificationRepository
  protected profileId!: MongoId
  protected notificationId!: MongoId

  protected readonly isExistedNotification =
    async (): Promise<INotificationDetails> => {
      const hasNotifications = await this.notificationRepository.findOne({
        filter: { belongsTo: this.profileId },
        populate: [
          {
            path: 'received.from',
            select: {
              _id: 1,
              username: 1,
              fullName: 1,
              content: 1,
              'avatar.secure_url': 1,
              'attachments.paths.secure_url': 1,
              'attachment.path.secure_url': 1,
            },
            options: { lean: true },
          },
          {
            path: 'received.on',
            select: {
              _id: 1,
              username: 1,
              fullName: 1,
              content: 1,
              'avatar.secure_url': 1,
              'attachments.paths.secure_url': 1,
              'attachment.path.secure_url': 1,
            },

            options: { lean: true },
          },
          {
            path: 'seen.from',
            select: {
              _id: 1,
              username: 1,
              fullName: 1,
              content: 1,
              'avatar.secure_url': 1,
              'attachments.paths.secure_url': 1,
              'attachment.path.secure_url': 1,
            },
            options: { lean: true },
          },
          {
            path: 'seen.on',
            select: {
              _id: 1,
              username: 1,
              fullName: 1,
              content: 1,
              'avatar.secure_url': 1,
              'attachments.paths.secure_url': 1,
              'attachment.path.secure_url': 1,
            },

            options: { lean: true },
          },
        ],
        options: { lean: true },
      })

      if (!hasNotifications)
        return throwError({
          msg: 'Un-Existed Notification or In-valid Id',
          status: 404,
        })

      const { received, seen } = hasNotifications

      const inReceived =
        received &&
        received.some(notification =>
          notification._id!.equals(this.notificationId),
        )
      const inSeen =
        seen &&
        seen.some(notification => notification._id!.equals(this.notificationId))

      if (inReceived) {
        const notification = received.find(e =>
          e._id!.equals(this.notificationId),
        )!

        return notification
      }

      if (inSeen) {
        const notification = seen.find(e => e._id!.equals(this.notificationId))!
        return notification
      }

      return throwError({
        msg: 'Un-Existed Notification or In-valid Id',
        status: 404,
      })
    }

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetNotification>()
      const { _id: profileId } = req.profile
      const { id } = { ...req.params, ...req.query }

      this.profileId = profileId
      this.notificationId = id

      req.notification = await this.isExistedNotification()

      return true
    }

    if (Ctx.type === ContextType.graphContext) {
      const { args, context } = Ctx.switchToGraphQL<IGetNotification>()
      const { _id: profileId } = context.profile
      const { id } = args

      this.profileId = profileId
      this.notificationId = id

      context.notification = await this.isExistedNotification()

      return true
    }
  }
}

export default new NotificationExistence()
