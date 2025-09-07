import connectedUsersController from "../../../../common/controllers/connected-users.controller"
import roomMembersController from "../../../../common/controllers/room-members.controller"
import chatRepository from "../../../../common/repositories/chat.repository"

import { MongoId } from "../../../../common/types/db"
import { getNowMoment } from "../../../../common/decorators/moment/moment"

export class ChatHelpers {
  public static readonly isInChat = ({
    roomId,
    userId,
  }: {
    roomId: string
    userId: MongoId
  }): boolean => {
    const roomMembers = roomMembersController.getRoomMembers(roomId)

    if (roomMembers.length == 0) return false

    const inChat = roomMembers.includes(userId.toString())

    if (!inChat) return false

    return true
  }

  public static readonly isOnline = (userId: MongoId): boolean => {
    const userStatus = connectedUsersController.getUserStatus(userId)

    if (!userStatus) return false

    const { isOnline } = userStatus

    return isOnline
  }

  public static readonly upsertChatMessage = async ({
    roomId,
    message,
    profileId,
    userId,
  }: {
    roomId: string
    profileId: MongoId
    userId: MongoId
    message: string
  }) => {
    const inChat = this.isInChat({ roomId: roomId, userId: userId })

    const existedChat = (await chatRepository.findOne({
      filter: {
        _id: roomId,
      },
    }))!
    console.log({ inChat })
    console.log({ roomId })
    console.log({ existedChat })

    if (!inChat) {
      existedChat.newMessages.unshift({
        from: profileId,
        to: userId,
        message,
        sentAt: getNowMoment(),
      })
      await existedChat.save()
      return existedChat.newMessages[0]
    }

    existedChat.messages.unshift({
      from: profileId,
      to: userId,
      message,
      sentAt: getNowMoment(),
    })
    await existedChat.save()
    return existedChat.messages[0]
  }
}
