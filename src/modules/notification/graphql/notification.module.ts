import { returnedType } from "../../../common/decorators/resolver/returned-type.decorator"
import notificationController from "./notification.controller"

export const queryModule = (() => {
  return {
    type: returnedType({
      name: "notificationQuery",
      fields: {
        getAllNotifications: notificationController.getAllNotifications(),
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
