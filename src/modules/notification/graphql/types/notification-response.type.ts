import {
  returnedResponseType,
  returnedType,
} from '../../../../common/decorators/resolver/returned-type.decorator'

import { notificationFields } from './notification-fields.type'

export class NotificationResponse {
  static readonly getAllNotifications = () => {
    return returnedResponseType({
      name: 'getAllNotificationsResponse',
      data: returnedType({
        name: 'notificationsDataResponse',
        fields: {
          notifications: {
            type: returnedType({
              name: 'notificationDetailsResponse',
              fields: notificationFields,
            }),
          },
        },
      }),
    })
  }
}
