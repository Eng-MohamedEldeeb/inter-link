import { GuardActivator } from "../../decorators/guard/guard-activator.guard"
import { MongoId } from "../../types/db"
import { ContextDetector } from "../../decorators/context/context-detector.decorator"
import { throwError } from "../../handlers/error-message.handler"

import {
  ContextType,
  GraphQLParams,
  HttpParams,
} from "../../decorators/context/types"

import { IMessageDetail } from "../../../modules/apis/chat/dto/chat.dto"
import { messageRepository } from "../../../db/repositories"

class MessageExistence extends GuardActivator {
  private readonly messageRepository = messageRepository
  private messageId!: MongoId
  private chatId!: MongoId

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IMessageDetail>()

      this.chatId = req.params.chatId
      this.messageId = req.params.messageId

      req.message = await this.isExistedMessage()
    }

    if (Ctx.type === ContextType.graphContext) {
      const { args, context } = Ctx.switchToGraphQL<IMessageDetail>()

      this.messageId = args.messageId
      this.chatId = args.chatId

      context.message = await this.isExistedMessage()
    }

    return true
  }

  private readonly isExistedMessage = async () => {
    const isExisted = await this.messageRepository.findOne({
      filter: {
        $and: [
          {
            $and: [
              {
                _id: this.messageId,
              },
              {
                chatId: this.chatId,
              },
            ],
          },
          {
            deletedAt: { $exists: false },
          },
        ],
      },
    })

    if (!isExisted)
      return throwError({ msg: "Message Doesn't Exist", status: 404 })

    return isExisted
  }
}

export default new MessageExistence()
