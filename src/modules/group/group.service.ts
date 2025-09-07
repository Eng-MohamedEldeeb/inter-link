import { MongoId } from "../../common/types/db"
import { throwError } from "../../common/handlers/error-message.handler"
import { getNowMoment } from "../../common/decorators/moment/moment"

import { TGroup, TNotification } from "../../db/documents"

import {
  IGroup,
  IGroupMessageDetails,
} from "../../db/interfaces/IGroup.interface"

import {
  IMissedMessages,
  INotifications,
  UserDetails,
} from "../../db/interfaces/INotification.interface"

import * as DTO from "./dto/group.dto"

import groupRepository from "../../common/repositories/group.repository"
import notifyService from "../../common/services/notify/notify.service"
import notificationRepository from "../../common/repositories/notification.repository"

class GroupService {
  protected readonly groupRepository = groupRepository
  protected readonly notificationRepository = notificationRepository
  protected readonly notifyService = notifyService

  protected profileId!: MongoId

  protected userSocketId!: string

  public readonly getAllGroups = async (
    profileId: MongoId,
  ): Promise<IGroup[]> => {
    const chats = await this.groupRepository.find({
      filter: { $or: [{ createdBy: profileId }, { members: profileId }] },
      projection: {
        messages: {
          $slice: 1,
        },
      },
      options: { lean: true },
      populate: [
        {
          path: "members",
          select: {
            _id: 1,
            username: 1,

            "avatar.secure_url": 1,
          },
        },
      ],
    })

    return chats
  }

  public readonly getSingle = async (group: TGroup) => {
    return group
  }

  public readonly create = async ({
    createdBy,
    members,
    description,
    name,
    cover,
  }: DTO.ICreateGroup) => {
    const isExistedGroupName = await this.groupRepository.findOne({
      filter: {
        name,
      },
      projection: { _id: 1 },
    })

    if (isExistedGroupName)
      return throwError({ msg: "Group Name Is Already Used", status: 400 })

    return await this.groupRepository.create({
      createdBy,
      members: [createdBy, ...members],
      description,
      name,
      cover,
    })
  }

  public readonly likeMessage = async ({
    profile,
    messageId,
    group,
  }: {
    profile: UserDetails
    messageId: MongoId
    group: TGroup
  }) => {
    const { inMessages } = this.findMessage({ group, messageId }) as {
      inMessages: IGroupMessageDetails
    }

    const isLiked = this.checkLikes({ message: inMessages, profile })

    if (isLiked)
      return await this.groupRepository.findOneAndUpdate({
        filter: {
          $and: [{ _id: group._id }, { "messages._id": messageId }],
        },
        data: {
          $pull: {
            "messages.$.likedBy": profile._id,
          },
        },
      })

    await this.groupRepository.findOneAndUpdate({
      filter: {
        $and: [{ _id: group._id }, { "messages._id": messageId }],
      },
      data: {
        $addToSet: {
          "messages.$.likedBy": profile._id,
        },
      },
    })

    this.notifyService.sendNotification({
      userId: inMessages.from,
      notificationDetails: {
        from: profile,
        message: `${profile.username} Liked Your Message 🧡`,
        refTo: "Chat",
        sentAt: getNowMoment(),
      },
    })
  }

  protected readonly findMessage = ({
    group,
    notifications,
    messageId,
  }: {
    group?: TGroup
    notifications?: TNotification[]
    messageId: MongoId
  }): {
    inMessages: IGroupMessageDetails | IMissedMessages[] | undefined
  } => {
    let inMessages: IGroupMessageDetails | IMissedMessages[] | undefined

    if (group) {
      inMessages = group.messages.find(message =>
        message._id?.equals(messageId),
      )
    }

    if (notifications && notifications.length) {
      const messages: IMissedMessages[] = []

      notifications.forEach(notification => {
        const message = notification.missedMessages.find(missedMessage =>
          missedMessage.messageId?.equals(messageId),
        )
        if (message) messages.push(message)
        inMessages = messages
      })
    }

    if (!inMessages)
      return throwError({ msg: "message was not found", status: 404 })

    return { inMessages }
  }

  protected readonly checkLikes = ({
    message,
    profile,
  }: {
    message: IGroupMessageDetails
    profile: UserDetails
  }) => {
    const likedBy = message.likedBy

    if (!likedBy || likedBy.length == 0) return false

    return likedBy.some(user => user._id.equals(profile._id))
  }

  public readonly editMessage = async ({
    profileId,
    messageId,
    groupId,
    newMessage,
  }: {
    profileId: MongoId
    messageId: MongoId
    groupId: MongoId
    newMessage: string
  }) => {
    const group = await this.findUserMessageInGroup({
      groupId,
      messageId,
      profileId,
    })

    const groupMessage = this.findMessage({
      group,
      messageId,
    }).inMessages as IGroupMessageDetails

    const relatedNotification = await this.findRelatedNotification({
      messageFrom: profileId,
      searchedMessage: groupMessage.message,
    })

    groupMessage.message = newMessage
    groupMessage.updatedAt = new Date(Date.now())

    const notificationMessage = this.findMessage({
      notifications: relatedNotification,
      messageId,
    }).inMessages as IMissedMessages[]

    notificationMessage.map(missedMessage => {
      missedMessage.message = newMessage
      missedMessage.updatedAt = new Date(Date.now())
      return missedMessage
    })

    if (relatedNotification.length)
      return await Promise.all([
        group.save(),
        relatedNotification.forEach(doc => doc.save()),
      ])

    return group.save()
  }

  protected readonly findUserMessageInGroup = async ({
    groupId,
    messageId,
    profileId,
  }: {
    groupId: MongoId
    messageId: MongoId
    profileId: MongoId
  }) => {
    const group = await this.groupRepository.findOne({
      filter: {
        $and: [
          { _id: groupId },
          {
            $and: [
              { "messages._id": messageId },
              { "messages.from": profileId },
            ],
          },
        ],
      },
    })

    return group
      ? group
      : throwError({ msg: "message was not found", status: 404 })
  }

  protected readonly findRelatedNotification = async ({
    messageFrom,
    searchedMessage,
  }: {
    messageFrom: MongoId
    searchedMessage: string
  }) => {
    return await this.notificationRepository.find({
      filter: {
        $and: [
          {
            "missedMessages.from": messageFrom,
          },
          {
            $and: [
              {
                "missedMessages.message": {
                  $regex: searchedMessage,
                },
              },
              { "missedMessages.deletedAt": { $exists: false } },
            ],
          },
        ],
      },
    })
  }

  protected readonly hasRelatedNotification = ({
    relatedNotification,
    messageId,
  }: {
    relatedNotification: INotifications
    messageId: MongoId
  }) => {
    return relatedNotification.missedMessages.find(message =>
      message._id?.equals(messageId),
    )
  }

  public readonly deleteMessage = async ({
    profileId,
    messageId,
    groupId,
  }: {
    profileId: MongoId
    messageId: MongoId
    groupId: MongoId
  }) => {
    const deletedMessage = await this.groupRepository.findOneAndUpdate({
      filter: {
        $and: [
          {
            $and: [{ _id: groupId }, { "messages._id": messageId }],
          },
          {
            $and: [
              { "messages.from": profileId },
              { "messages.deletedAt": { $exists: false } },
            ],
          },
        ],
      },
      data: {
        "messages.$.message": "message is deleted",
        "messages.$.deletedAt": Date.now(),
      },
    })

    return (
      deletedMessage ??
      throwError({
        msg: "Message was not deleted as it was not found",
        status: 404,
      })
    )
  }

  public readonly editGroup = async (
    updateGroupDTO: Omit<DTO.IUpdateGroup, "cover" | "members">,
  ) => {
    return await this.groupRepository.findOneAndUpdate({
      filter: {
        $and: [
          { _id: updateGroupDTO.id },
          { createdBy: updateGroupDTO.createdBy },
        ],
      },
      data: {
        ...updateGroupDTO,
      },
    })
  }
  public readonly deleteGroup = async ({ profileId, id }: DTO.IDeleteGroup) => {
    return await this.groupRepository.findOneAndDelete({
      filter: {
        $and: [{ _id: id }, { createdBy: profileId }],
      },
    })
  }
}

export default new GroupService()
