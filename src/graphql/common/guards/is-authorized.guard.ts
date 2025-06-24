import { throwHttpError } from '../../../common/utils/handlers/error-message.handler'
import userRepository from '../../../common/repositories/user.repository'
import { GuardActivator } from './can-activate.guard'
import { IContext } from '../interface/IGraphQL.types'

class IsAuthorizedGuard implements GuardActivator<any, IContext> {
  private readonly userRepository = userRepository

  async canActivate(_: any, context: IContext) {
    const { _id, iat } = context.tokenPayload

    const userExists = await this.userRepository.findById({
      _id,
      projection: { _id: 1, changedCredentialsAt: 1 },
      options: { lean: true },
    })

    if (!userExists)
      return throwHttpError({ msg: 'un-authenticated user', status: 403 })

    if (
      iat &&
      iat < Math.ceil(userExists.changedCredentialsAt?.getTime() / 1000)
    )
      return throwHttpError({ msg: 're-login is required', status: 403 })

    context.user = userExists

    return context
  }
}

export default new IsAuthorizedGuard()
