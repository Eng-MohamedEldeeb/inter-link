import { INotificationInputs } from '../../../db/interfaces/INotification.interface'
import { IGetNotification } from '../../../modules/notification/dto/notification.dto'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types'
import { throwError } from '../../handlers/error-message.handler'
import { MongoId } from '../../types/db'

import { GraphQLParams, HttpParams } from '../../decorators/context/types'

import notificationRepository from '../../repositories/notification.repository'
import { GuardActivator } from '../class/guard-activator.class'

class NotificationExistenceGuard extends GuardActivator {
  protected readonly notificationRepository = notificationRepository
  protected profileId!: MongoId
  protected notificationId!: MongoId

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetNotification>()
      const { _id: profileId } = req.profile
      const { id } = { ...req.params, ...req.query }

      this.profileId = profileId
      this.notificationId = id

      req.notification = await this.getNotificationDetails()
    }

    if (Ctx.type === ContextType.graphContext) {
      const { args, context } = Ctx.switchToGraphQL<IGetNotification>()
      const { _id: profileId } = context.profile
      const { id } = args

      this.profileId = profileId
      this.notificationId = id

      context.notification = await this.getNotificationDetails()
    }

    return true
  }

  protected readonly getNotificationDetails =
    async (): Promise<INotificationInputs> => {
      const userNotification = await this.notificationRepository.findOne({
        filter: { belongsTo: this.profileId },
        populate: [
          {
            path: 'missedNotifications.from',
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
            path: 'missedNotifications.on',
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

      if (!userNotification)
        return throwError({
          msg: 'Un-Existed Notification or In-valid Id',
          status: 404,
        })

      const { missedNotifications, seen } = userNotification

      const inMissed =
        missedNotifications.length &&
        missedNotifications.find(this.targetedNotification)!

      if (inMissed) return inMissed

      const inSeen = seen.length && seen.find(this.targetedNotification)

      if (inSeen) return inSeen

      return throwError({
        msg: 'Un-Existed Notification or In-valid Id',
        status: 404,
      })
    }

  protected readonly targetedNotification = (
    notification: INotificationInputs,
    i: number,
    obj: INotificationInputs[],
  ) => notification._id?.toString() === this.notificationId.toString()
}

export default new NotificationExistenceGuard()
