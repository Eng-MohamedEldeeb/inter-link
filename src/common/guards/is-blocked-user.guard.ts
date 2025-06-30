import { Types } from 'mongoose'
import { IGetUserProfileDTO } from '../../http/modules/user/dto/user.dto'
import { ContextDetector } from '../decorators/context/context-detector.decorator'
import { throwHttpError } from '../handlers/http/error-message.handler'
import { GuardActivator } from './can-activate.guard'

class IsBlockedUserGuard extends GuardActivator {
  canActivate(...params: any[any]) {
    const { req } = ContextDetector.switchToHTTP<
      Pick<IGetUserProfileDTO, 'id'>,
      IGetUserProfileDTO
    >(params)

    const { blockList } = req.profile
    const { _id: userId } = req.user

    console.log({ blockList })
    console.log({ userId })
    console.log({
      isBlocked: blockList.some((id: Types.ObjectId) => id.equals(userId)),
    })

    if (blockList.some((id: Types.ObjectId) => id.equals(userId)))
      return throwHttpError({ msg: 'user not found', status: 404 })

    return true
  }
}

export default new IsBlockedUserGuard()
