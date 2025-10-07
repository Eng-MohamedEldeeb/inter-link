import * as DTO from "./dto/chat.dto"

import { Notify } from "../../../common/services/notify/notify.event"

import { MongoId } from "../../../common/types/db"
import {
  IMessageInputs,
  MessageStatus,
} from "../../../db/interfaces/IMessage.interface"
import { TChat, TMessage } from "../../../db/documents"
import { ICloudFile } from "../../../common/services/upload/interface/cloud-response.interface"
import { IUser } from "../../../db/interfaces/IUser.interface"
import {
  notificationRepository,
  chatRepository,
} from "../../../db/repositories"
import { throwError } from "../../../common/handlers/error-message.handler"

class ChatService {
  private readonly chatRepository = chatRepository
  private readonly notificationRepository = notificationRepository
  private readonly Notify = Notify

  private chatId!: MongoId
  private userId!: MongoId
  private profileId!: MongoId

  private userSocketId!: string

  public set setUserId(userId: MongoId) {
    this.userId = userId
  }
  public set setProfileId(profileId: MongoId) {
    this.profileId = profileId
  }

  public set setCurrentChatId(chatId: MongoId) {
    this.chatId = chatId
  }

  public get getCurrentChatId(): MongoId {
    return this.chatId
  }

  public readonly getAllChats = async (profileId: MongoId) => {
    return await this.chatRepository.find({
      filter: { $or: [{ startedBy: profileId }, { participants: profileId }] },
      options: { sort: { totalNewMessages: -1 } },
      populate: [
        {
          path: "startedBy",
          select: {
            _id: 1,
            username: 1,
            "avatar.secure_url": 1,
          },
          options: { lean: true },
        },
        {
          path: "participants",
          select: {
            _id: 1,
            username: 1,
            "avatar.secure_url": 1,
          },
          options: { lean: true },
        },
        { path: "lastMessage", options: { lean: true } },
        { path: "newMessages", options: { lean: true } },
      ],
    })
  }

  public readonly getSingle = async (chat: TChat) => {
    const isExistedChat = await this.chatRepository.findOne({
      filter: { _id: chat._id },
      populate: [
        {
          path: "startedBy",
          select: {
            _id: 1,
            username: 1,
            "avatar.secure_url": 1,
          },
          options: { lean: true },
        },
        {
          path: "participants",
          select: {
            _id: 1,
            username: 1,
            "avatar.secure_url": 1,
          },
          options: { lean: true },
        },

        {
          path: "messages",
          populate: [
            {
              path: "sender",
              select: {
                _id: 1,
                username: 1,
                "avatar.secure_url": 1,
              },
              options: { lean: true },
            },
            {
              path: "receiver",
              select: {
                _id: 1,
                username: 1,
                "avatar.secure_url": 1,
              },
              options: { lean: true },
            },
          ],
          options: { lean: true },
        },

        { path: "newMessages" },
      ],
    })

    if (!isExistedChat)
      return throwError({
        msg: "Un-Existed Chat or Invalid Id",
        status: 404,
      })

    // TODO
    // isExistedChat.newMessages.forEach(message => {
    //   message.receivedAt = new Date(Date.now())
    //   message.seenAt = new Date(Date.now())
    //   message.status = MessageStatus.seen
    //   message.save()
    // })

    return isExistedChat
  }

  public readonly sendImage = async ({
    image,
    profileId,
    user,
  }: {
    image: ICloudFile
    profileId: MongoId
    user: IUser
  }) => {
    // this.notifyService.sendNotification({
    //   receiver: user._id,
    //   body: {
    //     sender: profile._id,
    //     message: `${profile.username} Sent a Picture 📷`,
    //     attachment: image.path.secure_url,
    //     refTo: "Chat",
    //     sentAt: currentMoment(),
    //   },
    // })
  }

  public readonly likeMessage = async ({
    profileId,
    messageId,
    chat,
  }: {
    profileId: MongoId
    messageId: MongoId
    chat: TChat
  }) => {
    // const { inMessages, inUnread } = this.findMessage({ chat, messageId })
    // const message = (inMessages ? inMessages : inUnread)!
    // const isLiked = this.checkLikes({ message, profile })
    // if (isLiked)
    //   return await this.chatRepository.findOneAndUpdate({
    //     filter: {
    //       $and: [{ _id: chat._id }, { "messages._id": messageId }],
    //     },
    //     data: {
    //       $pull: {
    //         "messages.$.likedBy": profile._id,
    //       },
    //     },
    //   })
    // await this.chatRepository.findOneAndUpdate({
    //   filter: {
    //     $and: [{ _id: chat._id }, { "messages._id": messageId }],
    //   },
    //   data: {
    //     $addToSet: {
    //       "messages.$.likedBy": profile._id,
    //     },
    //   },
    // })
    // this.notifyService.sendNotification({
    //   userId: message.from._id,
    //   notificationDetails: {
    //     from: profile,
    //     message: `${profile.username} Liked Your Message 🧡`,
    //     messageId,
    //     refTo: "Chat",
    //     sentAt: currentMoment(),
    //   },
    // })
  }

  private readonly checkLikes = ({
    message,
    profileId,
  }: {
    message: IMessageInputs
    profileId: MongoId
  }) => {
    // const likedBy = message.likedBy
    // if (!likedBy || likedBy.length == 0) return false
    // return likedBy.some(user => user._id.equals(profile._id))
  }

  public readonly editMessage = async ({
    oldMessage,
    newMessage,
  }: {
    oldMessage: TMessage
    newMessage: string
  }) => {
    oldMessage.message = newMessage

    return await oldMessage.save()
  }

  public readonly deleteMessage = async (message: TMessage) => {
    message.deletedAt = new Date(Date.now())

    return await message.save()
  }

  public readonly deleteChat = async ({
    profileId,
    chat,
  }: Omit<DTO.IDeleteChat, "chatId">) => {
    const startedChat = chat.startedBy.equals(profileId)
    if (startedChat) await chat.updateOne({ $unset: { startedBy: 1 } })
    const participant = chat.startedBy.equals(profileId)
    if (participant) await chat.updateOne({ $unset: { participants: 1 } })
    await chat.save()
  }
}

export default new ChatService()
