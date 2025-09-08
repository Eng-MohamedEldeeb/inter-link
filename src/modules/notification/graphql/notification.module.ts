import notificationController from "./notification.controller"
import { returnedType } from "../../../common/decorators/resolver/returned-type.decorator"

export const queryModule = (() => {
  return {
    type: returnedType({
      name: "notificationQuery",
      fields: {
        getUserNotifications: notificationController.getUserNotifications(),
      },
    }),
    resolve: () => true,
  }
})()

export const mutationModule = (() => {
  return {
    type: returnedType({
      name: "notificationMutation",
      fields: {
        deleteNotification: notificationController.deleteNotification(),
      },
    }),
    resolve: () => true,
  }
})()
