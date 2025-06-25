import userRepository from '../../../common/repositories/user.repository'
import { GuardActivator } from './can-activate.guard'
import { IContext } from '../interface/IGraphQL.types'
import { throwGraphError } from '../handler/error.handler'

class IsAuthorizedGuard implements GuardActivator<any, IContext> {
  private readonly userRepository = userRepository

  async canActivate(_: any, context: IContext) {
    const { _id, iat } = context.tokenPayload

    const isExistedUser = await this.userRepository.findOne({
      filter: {
        _id,
        deactivatedAt: { $exists: false },
      },
      projection: { password: 0, oldPasswords: 0 },
      options: { lean: true },
    })

    if (!isExistedUser) return throwGraphError('un-authenticated user')

    if (
      iat &&
      iat < Math.ceil(isExistedUser.changedCredentialsAt?.getTime() / 1000)
    )
      return throwGraphError('re-login is required')

    context.profile = isExistedUser

    return context
  }
}

export default new IsAuthorizedGuard()
