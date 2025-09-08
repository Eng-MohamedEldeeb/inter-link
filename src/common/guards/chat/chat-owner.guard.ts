import { GuardActivator } from "../../decorators/guard/guard-activator.guard"
import { MongoId } from "../../types/db"
import { ContextDetector } from "../../decorators/context/context-detector.decorator"

import {
  ContextType,
  GraphQLParams,
  HttpParams,
} from "../../decorators/context/types"

import { IGetSingleChat } from "../../../modules/chat/dto/chat.dto"

class ChatOwnerGuard extends GuardActivator {
  private chatStartedById!: MongoId
  private participants!: MongoId[]
  private profileId!: MongoId

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetSingleChat>()

      const { startedBy, participants } = req.chat
      const { _id: profileId } = req.profile

      this.chatStartedById = startedBy
      this.participants = participants
      this.profileId = profileId
    }

    return this.isChatOwner()
  }

  private readonly isChatOwner = async () => {
    const isTheOwner = this.chatStartedById._id.equals(this.profileId)

    const isInParticipants = this.participants.some(userId =>
      userId.equals(this.profileId),
    )

    return !isTheOwner && !isInParticipants ? false : true
  }
}

export default new ChatOwnerGuard()
