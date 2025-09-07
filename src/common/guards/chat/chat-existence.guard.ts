import { GuardActivator } from "../../decorators/guard/guard-activator.guard"
import { MongoId } from "../../types/db"
import { ContextDetector } from "../../decorators/context/context-detector.decorator"
import { throwError } from "../../handlers/error-message.handler"

import {
  ContextType,
  GraphQLParams,
  HttpParams,
} from "../../decorators/context/types"

import chatRepository from "../../repositories/chat.repository"
import { IGetSingleChat } from "../../../modules/chat/dto/chat.dto"

class ChatExistenceGuard extends GuardActivator {
  protected readonly chatRepository = chatRepository
  protected chatId!: MongoId
  protected profileId!: MongoId

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetSingleChat>()

      const { chatId } = { ...req.params, ...req.query }
      const { _id: profileId } = req.profile

      this.chatId = chatId
      this.profileId = profileId

      req.chat = await this.getChatDetails()
    }

    return true
  }

  protected readonly getChatDetails = async () => {
    const select = {
      _id: 1,
      username: 1,

      "avatar.secure_url": 1,
    }

    const isExistedChat = await this.chatRepository.findOne({
      filter: {
        $and: [
          { _id: this.chatId },
          {
            $or: [
              { startedBy: this.profileId },
              { participants: this.profileId },
            ],
          },
        ],
      },
      projection: {
        messages: {
          $slice: 5,
        },
      },
      populate: [
        {
          path: "startedBy",
          select,
        },
        {
          path: "participant",
          select,
        },
        {
          path: "messages.to",
          select,
        },
        {
          path: "messages.from",
          select,
        },
      ],
    })

    if (!isExistedChat)
      return throwError({
        msg: "Un-Existed Chat or Invalid Id",
        status: 404,
      })

    return isExistedChat
  }
}

export default new ChatExistenceGuard()
