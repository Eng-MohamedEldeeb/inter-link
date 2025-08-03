import { GuardActivator } from '../class/guard-activator.class'
import { MongoId } from '../../types/db'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { throwError } from '../../handlers/error-message.handler'

import {
  ContextType,
  GraphQLParams,
  HttpParams,
} from '../../decorators/context/types'

import { IGetSingleChat } from '../../../modules/chat/dto/chat.dto'

class ChatOwnerGuard extends GuardActivator {
  protected chatStartedById!: MongoId
  protected messaging!: MongoId
  protected profileId!: MongoId

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetSingleChat>()

      const { startedBy, messaging } = req.chat
      const { _id: profileId } = req.profile

      this.chatStartedById = startedBy
      this.messaging = messaging
      this.profileId = profileId
    }

    return this.isChatOwner()
  }

  protected readonly isChatOwner = async () => {
    const isTheOwner = this.chatStartedById._id.equals(
      this.profileId.toString(),
    )
    const isTheParticipant = this.messaging._id.equals(
      this.profileId.toString(),
    )

    return !isTheOwner && !isTheParticipant ? false : true
  }
}

export default new ChatOwnerGuard()
