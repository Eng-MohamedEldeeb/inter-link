import { throwHttpError } from '../utils/handlers/error-message.handler'
import { IRequest } from '../../common/interface/IRequest.interface'
import userRepository from '../../../common/repositories/user.repository'
import { GuardActivator } from './can-activate.guard'
import { IGetUserProfileDTO } from '../../modules/user/dto/user.dto'

class IsExistedUserGuard implements GuardActivator {
  private readonly userRepository = userRepository

  async canActivate(req: IRequest<IGetUserProfileDTO>) {
    const { id } = req.params
    const isExistedUser = await this.userRepository.findOne({
      filter: {
        $and: [{ _id: id }, { _id: { $ne: 'myId' } }],
        deactivatedAt: { $exists: false },
      },
    })

    if (!isExistedUser)
      return throwHttpError({ msg: 'un-authenticated user', status: 403 })

    req.user = isExistedUser

    return true
  }
}

export default new IsExistedUserGuard()
