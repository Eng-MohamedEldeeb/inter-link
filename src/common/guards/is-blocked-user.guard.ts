import { Types } from 'mongoose'
import { IGetUserProfileDTO } from '../../http/modules/user/dto/user.dto'
import { ContextDetector } from '../decorators/context/context-detector.decorator'
import { throwHttpError } from '../handlers/http/error-message.handler'
import { GuardActivator } from './can-activate.guard'
import { ContextType } from '../decorators/enums/async-handler.types'
import { MongoObjId } from '../types/mongo.types'

class IsBlockedUserGuard extends GuardActivator {
  canActivate(...params: any[any]) {
    const ctx = ContextDetector.detect(params)

    if (ctx.type === ContextType.httpContext) {
      const { req } = ctx.switchToHTTP<
        Pick<IGetUserProfileDTO, 'id'>,
        IGetUserProfileDTO
      >()

      const { blockedUsers } = req.profile
      const { _id: userId } = req.user

      const isBlockedUser =
        blockedUsers.length &&
        blockedUsers.some((id: MongoObjId) => id.equals(userId))

      if (isBlockedUser)
        return throwHttpError({ msg: 'user not found', status: 404 })

      return true
    }
  }
}

export default new IsBlockedUserGuard()
