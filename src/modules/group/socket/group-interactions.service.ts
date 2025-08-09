import { Server } from 'socket.io'
import { ISocket } from '../../../common/interface/ISocket.interface'
import moment from 'moment'
import { ISendMessage } from '../dto/group.dto'
import { throwError } from '../../../common/handlers/error-message.handler'
import groupRepository from '../../../common/repositories/group.repository'
import { MongoId } from '../../../common/types/db'
import roomMembersController from '../../../common/controllers/room-members.controller'

export const upsertGroupMessage = async ({
  groupId,
  message,
  profileId,
}: {
  groupId: MongoId
  profileId: MongoId
  message: string
}) => {
  const existedChat = await groupRepository.findOne({
    filter: {
      $and: [
        {
          _id: groupId,
        },
        {
          members: profileId,
        },
      ],
    },
  })

  if (!existedChat)
    return throwError({ msg: 'group was not found', status: 404 })

  console.log({ existedChat })
}

export const sendGroupMessage = (io: Server) => {
  return async (socket: ISocket) => {
    const profileId = socket.profile._id
    const groupId = socket.group._id

    roomMembersController.joinChat({ profileId, roomId: groupId })

    socket.join(groupId.toString())

    socket.on('send-message', async ({ message }: { message: string }) => {
      await upsertGroupMessage({ profileId, groupId, message })

      const data: ISendMessage = {
        message,
        sentAt: moment().format('h:mm A'),
        from: socket.profile,
      }

      return socket.to(groupId.toString()).emit('new-group-message', data)
    })

    socket.on('disconnect', () =>
      roomMembersController.leaveChat({ profileId, roomId: groupId }),
    )
  }
}
