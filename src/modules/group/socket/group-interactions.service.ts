import { Server } from "socket.io"
import { ISocket } from "../../../common/interface/ISocket.interface"
import { ISendMessage } from "../dto/group.dto"
import { throwError } from "../../../common/handlers/error-message.handler"
import { MongoId } from "../../../common/types/db"
import { UserDetails } from "../../../db/interfaces/INotification.interface"
import { currentMoment } from "../../../common/decorators/moment/moment"

import groupRepository from "../../../common/repositories/group.repository"
import notifyService from "../../../common/services/notify/notify.service"

export class GroupInteractions {
  // public static readonly upsertGroupMessage = async ({
  //   from,
  //   groupId,
  //   message,
  //   sentAt,
  // }: {
  //   message: string
  //   from: UserDetails
  //   sentAt: string
  //   groupId: MongoId
  // }) => {
  //   const { _id: profileId } = from
  //   const existedChat = await groupRepository.findOne({
  //     filter: {
  //       $and: [
  //         {
  //           _id: groupId,
  //         },
  //         {
  //           members: profileId,
  //         },
  //       ],
  //     },
  //     projection: { messages: 1 },
  //   })
  //   if (!existedChat)
  //     return throwError({ msg: "group was not found", status: 404 })
  //   existedChat.messages.unshift({ from: profileId, message, sentAt })
  //   return await existedChat.save()
  // }
  // public static readonly sendGroupMessage = (io: Server) => {
  //   return async (socket: ISocket) => {
  //     const profileId = socket.profile._id
  //     const groupId = socket.group._id
  //     const members = socket.group.members.map(member => member._id)
  //     roomMembersController.joinChat({ profileId, chatId: groupId })
  //     socket.join(groupId.toString())
  //     socket.on("send-message", async ({ message }: { message: string }) => {
  //       const data: ISendMessage = {
  //         message,
  //         sentAt: currentMoment(),
  //         from: socket.profile,
  //       }
  //       const updatedGroup = await this.upsertGroupMessage({ ...data, groupId })
  //       const onlineMembers = roomMembersController.getChatMembers(
  //         groupId.toString(),
  //       )
  //       const offlineMembers = members.filter(member => {
  //         if (!onlineMembers.includes(member._id.toString()))
  //           return member._id.toString()
  //       })
  //       if (offlineMembers.length) {
  //         for (const userId of offlineMembers) {
  //           notifyService.sendNotification({
  //             userId,
  //             notificationDetails: {
  //               ...data,
  //               refTo: "Group",
  //               on: groupId,
  //               messageId: updatedGroup.messages[0]._id,
  //             },
  //           })
  //         }
  //       }
  //       return socket.to(groupId.toString()).emit("new-group-message", data)
  //     })
  //     socket.on("disconnect", () =>
  //       roomMembersController.leaveChat({ profileId, chatId: groupId }),
  //     )
  //   }
  // }
}
