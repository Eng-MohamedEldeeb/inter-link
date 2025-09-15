import { applyResolver } from "../../../../common/decorators/resolver/apply-resolver.decorator"
import { graphResponseType } from "../../../../common/decorators/resolver/returned-type.decorator"
import { NotificationResponse } from "./types/notification-response"
import { validate } from "../../../../common/middlewares/validation/validation.middleware"

import * as resolvers from "./notification.resolver"
import * as args from "./types/notification-args"
import { NotificationValidator } from "../../../../validators"

import {
  isAuthenticatedGuard,
  isAuthorizedGuard,
  notificationExistenceGuard,
  notificationOwnerGuard,
} from "../../../../common/guards"

import {
  IMutationController,
  IQueryController,
} from "../../../../common/interface/IGraphQL.interface"

class NotificationController {
  private readonly notificationQueryResolver =
    resolvers.notificationQueryResolver
  private readonly notificationMutationResolver =
    resolvers.notificationMutationResolver

  // Queries:
  public readonly getUserNotifications = (): IQueryController => {
    return {
      type: graphResponseType({
        name: "getUserNotifications",
        data: NotificationResponse.getUserNotifications(),
      }),
      resolve: applyResolver({
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          notificationExistenceGuard,
        ],
        resolver: this.notificationQueryResolver.getUserNotifications,
      }),
    }
  }

  // Mutations:
  public readonly deleteNotification = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "deleteNotification",
      }),
      args: args.deleteNotification,
      resolve: applyResolver({
        middlewares: [
          validate(NotificationValidator.deleteNotificationValidator.graphql()),
        ],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          notificationExistenceGuard,
          notificationOwnerGuard,
        ],
        resolver: this.notificationMutationResolver.deleteNotification,
      }),
    }
  }
}

export default new NotificationController()
