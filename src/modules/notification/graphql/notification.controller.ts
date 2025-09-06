import {
  IMutationController,
  IQueryController,
} from "../../../common/interface/IGraphQL.interface"

import { applyResolver } from "../../../common/decorators/resolver/apply-resolver.decorator"
import { graphResponseType } from "../../../common/decorators/resolver/returned-type.decorator"
import { NotificationResponse } from "./types/notification-response.type"
import { validate } from "../../../common/middlewares/validation/validation.middleware"

import * as resolvers from "./notification.resolver"
import * as args from "./types/notification-args.type"
import * as validators from "../validators/notification.validators"

import isAuthenticatedGuard from "../../../common/guards/auth/is-authenticated.guard"
import isAuthorizedGuard from "../../../common/guards/auth/is-authorized.guard"
import NotificationExistenceGuardGuard from "../../../common/guards/notification/notification-owner.guard"
import NotificationOwnerGuardGuard from "../../../common/guards/notification/notification-owner.guard"

export class NotificationController {
  protected static readonly NotificationQueryResolver =
    resolvers.NotificationQueryResolver
  protected static readonly NotificationMutationResolver =
    resolvers.NotificationMutationResolver

  // Queries:
  public static readonly getAllNotifications = (): IQueryController => {
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
        resolver: this.NotificationQueryResolver.getAllNotifications,
      }),
    }
  }

  // Mutations:
  public static readonly deleteNotification = (): IMutationController => {
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
        resolver: this.NotificationMutationResolver.deleteNotification,
      }),
    }
  }
}
