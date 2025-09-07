import {
  IMutationController,
  IQueryController,
} from "../../../common/interface/IGraphQL.interface"

import { applyResolver } from "../../../common/decorators/resolver/apply-resolver.decorator"
import { graphResponseType } from "../../../common/decorators/resolver/returned-type.decorator"
import { NotificationResponse } from "./types/notification-response"
import { validate } from "../../../common/middlewares/validation/validation.middleware"

import * as resolvers from "./notification.resolver"
import * as args from "./types/notification-args"
import * as validators from "../validators/notification.validators"

import isAuthenticatedGuard from "../../../common/guards/auth/is-authenticated.guard"
import isAuthorizedGuard from "../../../common/guards/auth/is-authorized.guard"
import NotificationExistenceGuardGuard from "../../../common/guards/notification/notification-owner.guard"
import NotificationOwnerGuardGuard from "../../../common/guards/notification/notification-owner.guard"

class NotificationController {
  protected readonly notificationQueryResolver =
    resolvers.notificationQueryResolver
  protected readonly notificationMutationResolver =
    resolvers.notificationMutationResolver

  // Queries:
  public readonly getAllNotifications = (): IQueryController => {
    return {
      type: graphResponseType({
        name: "getAllNotifications",
        data: NotificationResponse.getAllNotifications(),
      }),
      resolve: applyResolver({
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          NotificationExistenceGuardGuard,
        ],
        resolver: this.notificationQueryResolver.getAllNotifications,
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
          validate(validators.deleteNotificationValidator.graphql()),
        ],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          NotificationExistenceGuardGuard,
          NotificationOwnerGuardGuard,
        ],
        resolver: this.notificationMutationResolver.deleteNotification,
      }),
    }
  }
}

export default new NotificationController()
