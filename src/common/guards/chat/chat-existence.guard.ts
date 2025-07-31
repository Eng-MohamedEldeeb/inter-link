import { GuardActivator } from '../class/guard-activator.class'
import { MongoId } from '../../types/db'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { throwError } from '../../handlers/error-message.handler'

import {
  ContextType,
  GraphQLParams,
  HttpParams,
} from '../../decorators/context/types'

import chatRepository from '../../repositories/chat.repository'
import { IGetSingleChat } from '../../../modules/chat/dto/chat.dto'

class ChatExistence extends GuardActivator {
  protected readonly chatRepository = chatRepository
  protected currentChatId!: MongoId
  protected profileId!: MongoId
  protected userId!: MongoId

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetSingleChat>()

      const { currentChatId } = req.params
      const { _id: profileId } = req.profile
      const { _id: userId } = req.user

      this.currentChatId = currentChatId
      this.profileId = profileId
      this.userId = userId

      req.chat = await this.getChatDetails()
    }

    return true
  }

  protected readonly getChatDetails = async () => {
    const select = {
      _id: 1,
      username: 1,
      fullName: 1,
      'avatar.secure_url': 1,
    }

    const isExistedChat = await this.chatRepository.findOne({
      filter: {
        $and: [
          { _id: this.currentChatId },
          {
            $or: [
              { startedBy: this.profileId, messaging: this.userId },
              { startedBy: this.userId, messaging: this.profileId },
            ],
          },
        ],
      },
      populate: [
        {
          path: 'to',
          select,
        },
        {
          path: 'from',
          select,
        },
        {
          path: 'startedBy',
          select,
        },
        {
          path: 'messaging',
          select,
        },
      ],
    })

    if (!isExistedChat)
      return throwError({
        msg: 'Un-Existed Chat or In-valid Id',
        status: 404,
      })

    return isExistedChat
  }
}

export default new ChatExistence()
