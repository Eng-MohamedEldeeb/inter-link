import { INotification } from "../../../db/interfaces/INotification.interface"
import { IGetNotification } from "../../../modules/apis/notification/dto/notification.dto"
import { ContextDetector } from "../../decorators/context/context-detector.decorator"
import { ContextType } from "../../decorators/context/types"
import { throwError } from "../../handlers/error-message.handler"
import { MongoId } from "../../types/db"

import { GraphQLParams, HttpParams } from "../../decorators/context/types"

import { notificationRepository } from "../../../db/repositories"
import { GuardActivator } from "../../decorators/guard/guard-activator.guard"

class NotificationExistenceGuard extends GuardActivator {
  private readonly notificationRepository = notificationRepository
  private profileId!: MongoId
  private notificationId!: MongoId

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

  private readonly getNotificationDetails =
    async (): Promise<INotification> => {
      const userNotification = await this.notificationRepository.findOne({
        filter: { receiver: this.profileId },

        options: { lean: true },
      })

      if (!userNotification)
        return throwError({
          msg: "Un-Existed Notification or Invalid Id",
          status: 404,
        })

      return userNotification
    }
}

export default new NotificationExistenceGuard()
