import { GuardActivator } from "../../decorators/guard/guard-activator.guard"
import { MongoId } from "../../types/db"
import { ContextDetector } from "../../decorators/context/context-detector.decorator"

import {
  ContextType,
  GraphQLParams,
  HttpParams,
} from "../../decorators/context/types"

import { IMessage } from "../../../db/interfaces/IMessage.interface"

class MessagePermission extends GuardActivator {
  private profileId!: MongoId
  private message!: IMessage

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP()
      this.profileId = req.profile._id
      this.message = req.message
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL()

      this.profileId = context.profile._id
      this.message = context.message
    }

    return this.isTheOwner()
  }

  private readonly isTheOwner = async () => {
    const { sender } = this.message
    if (!sender._id.equals(this.profileId)) return false

    return true
  }
}

export default new MessagePermission()
