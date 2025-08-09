import { ISocket } from '../../common/interface/ISocket.interface'
import { MongoId } from '../../common/types/db'
import {
  IGroup,
  IGroupMessageDetails,
} from '../../db/interfaces/IGroup.interface'
import { TGroup } from '../../db/documents'
import { throwError } from '../../common/handlers/error-message.handler'

import {
  INotifications,
  UserDetails,
} from '../../db/interfaces/INotification.interface'

import * as DTO from './dto/chat-group.dto'

import moment from 'moment'
import groupRepository from '../../common/repositories/group.repository'
import notificationsService from '../../common/services/notifications/notifications.service'
import notificationRepository from '../../common/repositories/notification.repository'
import connectedUserController from '../../common/controllers/connected-users.controller'
import { Types } from 'mongoose'
import { Server } from 'socket.io'

export class GroupService {
  protected static readonly groupRepository = groupRepository
  protected static readonly notificationRepository = notificationRepository
  protected static readonly notificationService = notificationsService

  protected static profileId: MongoId

  protected static groupId: MongoId
  protected static userSocketId: string

  public static readonly getAllChats = async (
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
          path: 'members',
          select: {
            _id: 1,
            username: 1,
            fullName: 1,
            'avatar.secure_url': 1,
          },
        },
      ],
    })

    return chats
  }

  public static readonly getSingle = async (group: TGroup) => {
    // if (group.newMessages.length >= 1) await this.emptyMissedMessages(group)

    return group
  }

  protected static readonly emptyMissedMessages = async (group: TGroup) => {
    // for (let i = group.newMessages.length - 1; i >= 0; i--) {
    //   group.messages.unshift(group.newMessages[i])
    // }
    // group.newMessages = []
    // return await group.save()
  }

  public static readonly create = async (createGroupDto: DTO.ICreateGroup) => {
    return await this.groupRepository.create(createGroupDto)
  }

  public static readonly sendMessage = (io: Server) => {
    return async (socket: ISocket) => {
      const { _id: profileId } = socket.profile
      // const { _id: groupId } = socket.group

      this.profileId = profileId

      this.userSocketId =
        connectedUserController.getUserStatus(profileId).socketId

      this.groupId = Types.ObjectId.createFromHexString(
        socket.handshake.query.id as string,
      )

      socket.on('send-message', async ({ message }: { message: string }) => {
        // await this.upsertChatMessage(message)

        const data: DTO.ISendMessage = {
          message,
          sentAt: moment().format('h:mm A'),
          from: socket.profile,
        }
        console.log(socket.handshake.query.id)

        return io
          .to([socket.handshake.query.id as string])
          .except(this.userSocketId)
          .emit('new-group-message', data)
      })
    }
  }
  protected static readonly isOnline = (): boolean => {
    const { isOnline, socketId } = connectedUserController.getUserStatus(
      this.groupId,
    )

    if (isOnline) this.userSocketId = socketId

    return isOnline
  }

  protected static readonly upsertChatMessage = async (message: string) => {
    const isOnline = this.isOnline()

    const existedGroup = await this.groupRepository.findOne({
      filter: {
        $or: [
          { members: this.profileId, participant: this.groupId },
          { participant: this.profileId, members: this.groupId },
        ],
      },
    })

    if (!existedGroup)
      return throwError({ msg: 'group not found', status: 404 })

    existedGroup.messages.unshift({
      from: this.profileId,
      message,
      sentAt: moment().format('h:mm A'),
    })

    return await existedGroup.save()
  }

  public static readonly likeMessage = async ({
    profile,
    messageId,
    group,
  }: {
    profile: UserDetails
    messageId: MongoId
    group: TGroup
  }) => {
    const { inMessages } = this.findMessage({ group, messageId })

    const isLiked = this.checkLikes({ message: inMessages, profile })

    if (isLiked)
      return await this.groupRepository.findOneAndUpdate({
        filter: {
          $and: [{ _id: group._id }, { 'messages._id': messageId }],
        },
        data: {
          $pull: {
            'messages.$.likedBy': profile._id,
          },
        },
      })

    await this.groupRepository.findOneAndUpdate({
      filter: {
        $and: [{ _id: group._id }, { 'messages._id': messageId }],
      },
      data: {
        $addToSet: {
          'messages.$.likedBy': profile._id,
        },
      },
    })
  }

  protected static readonly findMessage = ({
    group,
    messageId,
  }: {
    group: TGroup
    messageId: MongoId
  }): {
    inMessages: IGroupMessageDetails
  } => {
    const inMessages = group.messages.find(message =>
      message._id?.equals(messageId),
    )

    if (!inMessages)
      return throwError({ msg: 'message not found', status: 404 })

    return { inMessages }
  }

  protected static readonly checkLikes = ({
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

  public static readonly editMessage = async ({
    profileId,
    messageId,
    chatId,
    newMessage,
  }: {
    profileId: MongoId
    messageId: MongoId
    chatId: MongoId
    newMessage: string
  }) => {
    // const group = await this.findUserMessageInChat({
    //   chatId,
    //   messageId,
    //   profileId,
    // })
    // let searchedMessage: string = ''
    // const { inMessages } = this.findMessage({
    //   group,
    //   messageId,
    // })
    // if (inMessages) {
    //   searchedMessage = inMessages.message
    //   inMessages.message = newMessage
    //   inMessages.updatedAt = new Date(Date.now())
    // }
    // const groupId = group.createdBy.equals(profileId)
    //   ? group.participant
    //   : group.members
    // const relatedNotification = await this.findRelatedNotification({
    //   belongsTo: groupId,
    //   messageFrom: profileId,
    //   searchedMessage,
    // })
    // if (!relatedNotification) return chat
    // const relatedMissedMessages = this.hasRelatedNotification({
    //   relatedNotification,
    //   searchedMessage,
    // })
    // if (!relatedMissedMessages) return chat
    // relatedMissedMessages.notificationMessage = newMessage
    // relatedMissedMessages.updatedAt = new Date(Date.now())
    // return await Promise.all([group.save(), relatedNotification.save()])
  }

  protected static readonly findUserMessageInChat = async ({
    chatId,
    messageId,
    profileId,
  }: {
    chatId: MongoId
    messageId: MongoId
    profileId: MongoId
  }) => {
    const chat = await this.groupRepository.findOne({
      filter: {
        $and: [
          {
            $and: [
              { _id: chatId },
              {
                $or: [
                  { 'messages._id': messageId },
                  { 'newMessages._id': messageId },
                ],
              },
            ],
          },
          {
            $or: [
              {
                $and: [
                  { 'messages.from': profileId },
                  { 'messages.deletedAt': { $exists: false } },
                ],
              },
              {
                $and: [
                  { 'newMessages.from': profileId },
                  { 'newMessages.deletedAt': { $exists: false } },
                ],
              },
            ],
          },
        ],
      },
    })
    return chat!
  }

  protected static readonly findRelatedNotification = async ({
    belongsTo,
    messageFrom,
    searchedMessage,
  }: {
    belongsTo: MongoId
    messageFrom: MongoId
    searchedMessage: string
  }) => {
    return await this.notificationRepository.findOne({
      filter: {
        $and: [
          {
            $and: [{ belongsTo }, { 'missedMessages.from': messageFrom }],
          },
          {
            $and: [
              {
                'missedMessages.messages.notificationMessage': {
                  $regex: searchedMessage,
                },
              },
              { 'missedMessages.messages.deletedAt': { $exists: false } },
            ],
          },
        ],
      },
    })
  }

  protected static readonly hasRelatedNotification = ({
    relatedNotification,
    searchedMessage,
  }: {
    relatedNotification: INotifications
    searchedMessage: string
  }) => {
    return relatedNotification.missedMessages
      .find(missed =>
        missed.messages.some(
          message => message.notificationMessage == searchedMessage,
        ),
      )
      ?.messages.find(message => message.notificationMessage == searchedMessage)
  }

  public static readonly deleteMessage = async ({
    profileId,
    messageId,
    chatId,
  }: {
    profileId: MongoId
    messageId: MongoId
    chatId: MongoId
  }) => {
    const deletedMessage = await this.groupRepository.findOneAndUpdate({
      filter: {
        $and: [
          {
            $and: [{ _id: chatId }, { 'messages._id': messageId }],
          },
          {
            $and: [
              { 'messages.from': profileId },
              { 'messages.deletedAt': { $exists: false } },
            ],
          },
        ],
      },
      data: {
        'messages.$.message': 'message is deleted',
        'messages.$.deletedAt': Date.now(),
      },
    })

    return (
      deletedMessage ??
      throwError({
        msg: 'Message was not deleted as it was not found',
        status: 404,
      })
    )
  }

  public static readonly deleteChat = async ({
    profileId,
    group,
  }: Omit<DTO.IDeleteChat, 'chat' | 'groupId'>) => {
    await group.updateOne({ $pull: { members: profileId } })
  }
}
