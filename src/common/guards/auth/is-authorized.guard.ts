import { GuardActivator } from '../class/guard-activator.class'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types'
import { IContext } from '../../interface/IGraphQL.interface'
import { IRequest } from '../../interface/IRequest.interface'
import { IPayload } from '../../utils/security/token/interface/token.interface'
import { throwError } from '../../handlers/error-message.handler'

import {
  GraphQLParams,
  HttpParams,
  SocketServerParams,
} from '../../decorators/context/types'

import userRepository from '../../repositories/user.repository'
import { ISocket } from '../../interface/ISocket.interface'

class IsAuthorizedGuard implements GuardActivator {
  protected readonly userRepository = userRepository
  protected contextArg!: IRequest | IContext | ISocket
  protected tokenPayload!: IPayload
  protected changedCredentialsAt: Date | undefined = undefined

  async canActivate(
    ...params: HttpParams | GraphQLParams | SocketServerParams
  ) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP()
      this.contextArg = req
      return await this.httpAuthorization()
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL()
      this.contextArg = context
      return await this.graphQLAuthorization()
    }

    if (Ctx.type === ContextType.socketContext) {
      const { socket } = Ctx.switchToSocket()
      this.contextArg = socket
      return await this.socketAuthorization()
    }
  }

  protected readonly hasChangedCredentials = (): boolean => {
    const { iat } = this.tokenPayload

    if (!this.changedCredentialsAt) return false

    return iat < Math.ceil(this.changedCredentialsAt.getTime() / 1000)
  }

  protected readonly httpAuthorization = async () => {
    this.tokenPayload = this.contextArg.tokenPayload

    const isExistedUser = await this.userRepository.findOne({
      filter: {
        $and: [
          { _id: this.tokenPayload._id },
          { deactivatedAt: { $exists: false } },
        ],
      },
      projection: {
        password: 0,
        oldPasswords: 0,
        phone: 0,
        'avatar.public_id': 0,
        'avatar.folderPath': 0,
      },
      populate: [
        {
          path: 'posts',
        },
      ],
    })

    if (!isExistedUser)
      return throwError({ msg: 'un-authenticated user', status: 403 })

    this.changedCredentialsAt = isExistedUser.changedCredentialsAt

    if (this.hasChangedCredentials())
      return throwError({ msg: 're-login is required', status: 403 })

    this.contextArg.profile = isExistedUser

    return true
  }

  protected readonly graphQLAuthorization = async () => {
    this.tokenPayload = this.contextArg.tokenPayload

    const isExistedUser = await this.userRepository.findOne({
      filter: {
        $and: [
          { _id: this.tokenPayload._id },
          { deactivatedAt: { $exists: false } },
        ],
      },
      projection: { password: 0, oldPasswords: 0 },
      populate: [{ path: 'posts' }],
      options: { lean: true },
    })

    if (!isExistedUser)
      return throwError({ msg: 'un-authenticated user', status: 403 })

    this.changedCredentialsAt = isExistedUser.changedCredentialsAt

    if (this.hasChangedCredentials())
      return throwError({ msg: 're-login is required', status: 403 })

    this.contextArg.profile = isExistedUser

    return this.contextArg
  }

  protected readonly socketAuthorization = async () => {
    this.tokenPayload = this.contextArg.tokenPayload

    const isExistedUser = await this.userRepository.findOne({
      filter: {
        $and: [
          { _id: this.tokenPayload._id },
          { deactivatedAt: { $exists: false } },
        ],
      },
      projection: {
        _id: 1,
        username: 1,
        'avatar.secure_url': 1,
        fullName: 1,
      },
      options: { lean: true },
    })

    if (!isExistedUser)
      return throwError({ msg: 'un-authenticated user', status: 403 })

    this.changedCredentialsAt = isExistedUser.changedCredentialsAt

    if (this.hasChangedCredentials())
      return throwError({ msg: 're-login is required', status: 403 })

    this.contextArg.profile = isExistedUser

    return true
  }
}

export default new IsAuthorizedGuard()
