import { returnedType } from '../../../common/decorators/resolver/returned-type.decorator'
import { NotificationController } from './notification.controller'

export const queryModule = (() => {
  return {
    type: returnedType({
      name: 'notificationQuery',
      fields: {
        getAllNotifications: NotificationController.getAllNotifications(),
      },
    }),
    resolve: () => true,
  }
})()

export const mutationModule = (() => {
  return {
    type: returnedType({
      name: 'notificationMutation',
      fields: {
        deleteNotification: NotificationController.deleteNotification(),
      },
    }),
    resolve: () => true,
  }
})()
