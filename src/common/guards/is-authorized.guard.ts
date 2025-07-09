import userRepository from '../repositories/user.repository'
import { GuardActivator } from './can-activate.guard'
import { throwError } from '../handlers/error-message.handler'
import { ContextDetector } from '../decorators/context/context-detector.decorator'
import { ContextType } from '../decorators/context/types/enum/context-type.enum'
import { IContext } from '../decorators/graphql/types/IGraphQL.interface'
import { IRequest } from '../interface/http/IRequest.interface'
import {
  GraphQLParams,
  HttpParams,
} from '../decorators/context/types/context-detector.types'
import { IPayload } from '../utils/security/token/interface/token.interface'

class IsAuthorizedGuard implements GuardActivator {
  private readonly userRepository = userRepository
  protected changedCredentialsAt: Date | null = null

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP()
      return await this.httpAuthorization(req)
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL()

      return await this.graphQLAuthorization(context)
    }
  }

  protected readonly httpAuthorization = async (req: IRequest) => {
    const tokenPayload = req.tokenPayload

    const isExistedUser = await this.userRepository.findOne({
      filter: {
        $and: [
          { _id: tokenPayload._id },
          { deactivatedAt: { $exists: false } },
        ],
      },
      projection: { password: 0, oldPasswords: 0 },
      options: { lean: true },
    })

    if (!isExistedUser)
      return throwError({ msg: 'un-authenticated user', status: 403 })

    if (isExistedUser.changedCredentialsAt)
      this.changedCredentialsAt = isExistedUser.changedCredentialsAt

    const isPassedTokenInitiationStamp =
      this.checkTokenInitiationStamp(tokenPayload)

    if (isPassedTokenInitiationStamp)
      return throwError({ msg: 're-login is required', status: 403 })

    req.profile = isExistedUser

    return true
  }

  protected readonly graphQLAuthorization = async (context: IContext) => {
    const tokenPayload = context.tokenPayload

    const isExistedUser = await this.userRepository.findOne({
      filter: {
        $and: [
          { _id: tokenPayload._id },
          { deactivatedAt: { $exists: false } },
        ],
      },
      projection: { password: 0, oldPasswords: 0 },
      populate: [{ path: 'posts' }],
      options: { lean: true },
    })

    if (!isExistedUser)
      return throwError({ msg: 'un-authenticated user', status: 403 })

    if (isExistedUser.changedCredentialsAt)
      this.changedCredentialsAt = isExistedUser.changedCredentialsAt

    const isPassedTokenInitiationStamp =
      this.checkTokenInitiationStamp(tokenPayload)

    if (isPassedTokenInitiationStamp)
      return throwError({ msg: 're-login is required', status: 403 })

    context.profile = isExistedUser

    return context
  }

  protected readonly checkTokenInitiationStamp = (
    tokenPayload: IPayload,
  ): boolean => {
    const { iat } = tokenPayload

    if (iat && this.changedCredentialsAt)
      return iat < Math.ceil(this.changedCredentialsAt.getTime() / 1000)

    return false
  }
}

export default new IsAuthorizedGuard()
