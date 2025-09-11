import * as DTO from "./dto/chat.dto"

import notifyService from "../../common/services/notify/notify.service"

import {
  chatRepository,
  notificationRepository,
} from "../../common/repositories"

import {
  INotifications,
  UserDetails,
} from "../../db/interfaces/INotification.interface"

import { MongoId } from "../../common/types/db"
import { IMessageInputs } from "../../db/interfaces/IMessage.interface"
import { TChat } from "../../db/documents"
import { throwError } from "../../common/handlers/error-message.handler"
import { currentMoment } from "../../common/decorators/moment/moment"
import { ICloudFile } from "../../common/services/upload/interface/cloud-response.interface"
import { IUser } from "../../db/interfaces/IUser.interface"

class ChatService {
  private readonly chatRepository = chatRepository
  private readonly notificationRepository = notificationRepository
  private readonly notifyService = notifyService

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
    const chats = await this.chatRepository.find({
      filter: { $or: [{ startedBy: profileId }, { participants: profileId }] },
      // projection: {
      //   messages: {
      //     $slice: 1,
      //   },
      //   newMessages: {
      //     $slice: 1,
      //   },
      // },
      options: { lean: true },
      populate: [
        {
          path: "startedBy",
          select: {
            _id: 1,
            username: 1,
            "avatar.secure_url": 1,
          },
        },
        {
          path: "participant",
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

  public readonly getSingle = async (chat: TChat) => {
    // if (chat.newMessages.length >= 1) await this.emptyMissedMessages(chat)
    // return chat
  }

  private readonly emptyMissedMessages = async (chat: TChat) => {
    // for (let i = chat.newMessages.length - 1; i >= 0; i--) {
    //   chat.messages.unshift(chat.newMessages[i])
    // }
    // chat.newMessages = []
    // return await chat.save()
  }

  public readonly sendImage = async ({
    image,
    profile,
    user,
  }: {
    image: ICloudFile
    profile: UserDetails
    user: IUser
  }) => {
    // this.notifyService.sendNotification({
    //   userId: user._id,
    //   notificationDetails: {
    //     from: profile,
    //     message: `${profile.username} Sent a Picture 📷`,
    //     attachment: image.path.secure_url,
    //     refTo: "Chat",
    //     sentAt: currentMoment(),
    //   },
    // })
  }

  public readonly likeMessage = async ({
    profile,
    messageId,
    chat,
  }: {
    profile: UserDetails
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

  private readonly findMessage = ({
    chat,
    messageId,
  }: {
    chat: TChat
    messageId: MongoId
  }) => {
    // const inMessages = chat.messages.find(message =>
    //   message._id?.equals(messageId),
    // )
    // const inUnread = chat.newMessages.find(message =>
    //   message._id?.equals(messageId),
    // )
    // if (!inMessages && !inUnread)
    //   return throwError({ msg: "message not found", status: 404 })
    // return { inMessages, inUnread }
  }

  private readonly checkLikes = ({
    message,
    profile,
  }: {
    message: IMessageInputs
    profile: UserDetails
  }) => {
    // const likedBy = message.likedBy
    // if (!likedBy || likedBy.length == 0) return false
    // return likedBy.some(user => user._id.equals(profile._id))
  }

  public readonly editMessage = async ({
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
    // const chat = await this.findUserMessageInChat({
    //   chatId,
    //   messageId,
    //   profileId,
    // })
    // let searchedMessage: string = ""
    // const { inMessages, inUnread } = this.findMessage({
    //   chat,
    //   messageId,
    // })
    // if (inUnread) {
    //   searchedMessage = inUnread.message
    //   inUnread.message = newMessage
    //   inUnread.updatedAt = new Date(Date.now())
    // }
    // if (inMessages) {
    //   searchedMessage = inMessages.message
    //   inMessages.message = newMessage
    //   inMessages.updatedAt = new Date(Date.now())
    // }
    // const userId = chat.startedBy.equals(profileId)
    //   ? chat.participants[0]
    //   : chat.startedBy
    // const relatedNotification = await this.findRelatedNotification({
    //   belongsTo: userId,
    //   messageFrom: profileId,
    //   searchedMessage,
    // })
    // if (!relatedNotification) return await chat.save()
    // const relatedMissedMessages = this.hasRelatedNotification({
    //   relatedNotification,
    //   messageId,
    // })
    // if (!relatedMissedMessages) return chat
    // relatedMissedMessages.message = newMessage
    // relatedMissedMessages.updatedAt = new Date(Date.now())
    // return await Promise.all([chat.save(), relatedNotification.save()])
  }

  private readonly findUserMessageInChat = async ({
    chatId,
    messageId,
    profileId,
  }: {
    chatId: MongoId
    messageId: MongoId
    profileId: MongoId
  }) => {
    // const chat = await this.chatRepository.findOne({
    //   filter: {
    //     $and: [
    //       {
    //         $and: [
    //           { _id: chatId },
    //           {
    //             $or: [
    //               { "messages._id": messageId },
    //               { "newMessages._id": messageId },
    //             ],
    //           },
    //         ],
    //       },
    //       {
    //         $or: [
    //           {
    //             $and: [
    //               { "messages.from": profileId },
    //               { "messages.deletedAt": { $exists: false } },
    //             ],
    //           },
    //           {
    //             $and: [
    //               { "newMessages.from": profileId },
    //               { "newMessages.deletedAt": { $exists: false } },
    //             ],
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // })
    // return chat!
  }

  private readonly findRelatedNotification = async ({
    belongsTo,
    messageFrom,
    searchedMessage,
  }: {
    belongsTo: MongoId
    messageFrom: MongoId
    searchedMessage: string
  }) => {
    // return await this.notificationRepository.findOne({
    //   filter: {
    //     $and: [
    //       {
    //         $and: [{ belongsTo }, { "newMessages.from": messageFrom }],
    //       },
    //       {
    //         $and: [
    //           {
    //             "newMessages.messages.message": {
    //               $regex: searchedMessage,
    //             },
    //           },
    //           { "newMessages.messages.deletedAt": { $exists: false } },
    //         ],
    //       },
    //     ],
    //   },
    // })
  }

  private readonly hasRelatedNotification = ({
    relatedNotification,
    messageId,
  }: {
    relatedNotification: INotifications
    messageId: MongoId
  }) => {
    // return relatedNotification.newMessages.find(message =>
    //   message._id?.equals(messageId),
    // )
  }

  public readonly deleteMessage = async ({
    profileId,
    messageId,
    chatId,
  }: {
    profileId: MongoId
    messageId: MongoId
    chatId: MongoId
  }) => {
    // const deletedMessage = await this.chatRepository.findOneAndUpdate({
    //   filter: {
    //     $and: [
    //       {
    //         $and: [{ _id: chatId }, { "messages._id": messageId }],
    //       },
    //       {
    //         $and: [
    //           { "messages.from": profileId },
    //           { "messages.deletedAt": { $exists: false } },
    //         ],
    //       },
    //     ],
    //   },
    //   data: {
    //     "messages.$.message": "message is deleted",
    //     "messages.$.deletedAt": Date.now(),
    //   },
    // })
    // return (
    //   deletedMessage ??
    //   throwError({
    //     msg: "Message was not deleted as it was not found",
    //     status: 404,
    //   })
    // )
  }

  public readonly deleteChat = async ({
    profileId,
    chat,
  }: Omit<DTO.IDeleteChat, "chatId">) => {
    // const startedChat = chat.startedBy.equals(profileId)
    // if (startedChat) await chat.updateOne({ $unset: { startedBy: 1 } })
    // const participant = chat.startedBy.equals(profileId)
    // if (participant) await chat.updateOne({ $unset: { participants: 1 } })
    // await chat.save()
  }
}

export default new ChatService()
