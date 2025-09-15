import notificationService from "../notification.service"

import {
  IContext,
  ISuccessResponse,
} from "../../../../common/interface/IGraphQL.interface"

class NotificationQueryResolver {
  private readonly notificationService = notificationService

  public readonly getUserNotifications = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: postId } = context.post
    return {
      msg: "done",
      status: 200,
      data: await this.notificationService.getUserNotifications(postId),
    }
  }
}

class NotificationMutationResolver {
  private readonly notificationService = notificationService

  public readonly deleteNotification = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: profileId } = context.profile
    const { _id: id } = context.notifications

    await this.notificationService.deleteNotification({
      profileId,
      id,
    })

    return {
      msg: "Notification is deleted successfully",
      status: 200,
    }
  }
}

export const notificationQueryResolver = new NotificationQueryResolver()
export const notificationMutationResolver = new NotificationMutationResolver()
