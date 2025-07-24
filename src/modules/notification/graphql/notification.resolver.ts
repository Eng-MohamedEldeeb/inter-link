import {
  IContext,
  ISuccessResponse,
} from '../../../common/interface/IGraphQL.interface'

import { NotificationService } from '../notification.service'

export class NotificationQueryResolver {
  private static readonly NotificationService = NotificationService

  static readonly getAllNotifications = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: postId } = context.post
    return {
      msg: 'done',
      status: 200,
      data: await this.NotificationService.getAllNotifications(postId),
    }
  }
}

export class NotificationMutationResolver {
  private static readonly NotificationService = NotificationService

  static readonly deleteNotification = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id: profileId } = context.profile
    const { _id: id } = context.notifications

    await this.NotificationService.deleteNotification({
      profileId,
      id,
    })

    return {
      msg: 'Notification is deleted successfully',
      status: 200,
    }
  }
}
