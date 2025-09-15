import { GuardActivator } from "../../decorators/guard/guard-activator.guard"
import { MongoId } from "../../types/db"
import { ContextDetector } from "../../decorators/context/context-detector.decorator"
import { throwError } from "../../handlers/error-message.handler"

import {
  ContextType,
  GraphQLParams,
  HttpParams,
} from "../../decorators/context/types"

import { ILikeMessage } from "../../../modules/apis/chat/dto/chat.dto"
import { IMessageInputs } from "../../../db/interfaces/IMessage.interface"

class MessageExistence extends GuardActivator {
  private messageId!: MongoId
  private messages!: Required<IMessageInputs>[]

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<null, ILikeMessage>()

      // this.messages = req.chat.messages as Required<IMessageInputs>[]
      // this.messageId = req.query.messageId
    }

    return this.isExistedMessage()
  }

  private readonly isExistedMessage = async () => {
    // const isExisted = this.messages.some((message: Required<IMessageInputs>) =>
    //   message._id.equals(this.messageId),
    // )
    // if (!isExisted)
    //   return throwError({ msg: "Message Doesn't Exist", status: 404 })
    // return true
  }
}

export default new MessageExistence()
