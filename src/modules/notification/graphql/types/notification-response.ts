import {
  graphResponseType,
  returnedType,
} from "../../../../common/decorators/resolver/returned-type.decorator"

import { notificationFields } from "./notification-fields"

export class NotificationResponse {
  public static readonly getUserNotifications = () => {
    return graphResponseType({
      name: "getUserNotificationsResponse",
      data: returnedType({
        name: "notificationsDataResponse",
        fields: {
          notifications: {
            type: returnedType({
              name: "notificationDetailsResponse",
              fields: notificationFields,
            }),
          },
        },
      }),
    })
  }
}
