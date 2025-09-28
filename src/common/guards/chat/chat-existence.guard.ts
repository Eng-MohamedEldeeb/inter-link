import { GuardActivator } from "../../decorators/guard/guard-activator.guard"
import { MongoId } from "../../types/db"
import { ContextDetector } from "../../decorators/context/context-detector.decorator"
import { throwError } from "../../handlers/error-message.handler"

import {
  ContextType,
  GraphQLParams,
  HttpParams,
} from "../../decorators/context/types"

import { chatRepository } from "../../../db/repositories"
import { IGetSingleChat } from "../../../modules/apis/chat/dto/chat.dto"

class ChatExistenceGuard extends GuardActivator {
  private readonly chatRepository = chatRepository
  private chatId!: MongoId
  private profileId!: MongoId

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

  private readonly getChatDetails = async () => {
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
      projection: { _id: 1, startedBy: 1, participants: 1 },
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
