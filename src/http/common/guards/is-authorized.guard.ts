import { throwHttpError } from '../utils/handlers/error-message.handler'
import { IRequest } from '../../common/interface/IRequest.interface'
import userRepository from '../../../common/repositories/user.repository'
import { GuardActivator } from './can-activate.guard'

class IsAuthorizedGuard implements GuardActivator {
  private readonly userRepository = userRepository

  async canActivate(req: IRequest) {
    const { _id, iat } = req.tokenPayload

    const isExistedUser = await this.userRepository.findById({
      _id,
      projection: { password: 0, oldPasswords: 0 },
      options: { lean: true },
    })

    if (!isExistedUser)
      return throwHttpError({ msg: 'un-authenticated user', status: 403 })

    if (
      iat &&
      iat < Math.ceil(isExistedUser.changedCredentialsAt?.getTime() / 1000)
    )
      return throwHttpError({ msg: 're-login is required', status: 403 })

    req.profile = isExistedUser

    return true
  }
}

export default new IsAuthorizedGuard()
