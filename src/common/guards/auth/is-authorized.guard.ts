import { GuardActivator } from "../../decorators/guard/guard-activator.guard"
import { ContextDetector } from "../../decorators/context/context-detector.decorator"
import { ContextType } from "../../decorators/context/types"
import { IPayload } from "../../utils/security/token/interface/token.interface"
import { throwError } from "../../handlers/error-message.handler"

import {
  GraphQLParams,
  HttpParams,
  SocketServerParams,
} from "../../decorators/context/types"

import { userRepository } from "../../../db/repositories"

class IsAuthorizedGuard implements GuardActivator {
  private readonly userRepository = userRepository
  private tokenPayload!: IPayload
  private changedCredentialsAt: Date | undefined = undefined

  async canActivate(
    ...params: HttpParams | GraphQLParams | SocketServerParams
  ) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP()
      this.tokenPayload = req.tokenPayload
      req.profile = await this.httpAuthorization()
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL()
      this.tokenPayload = context.tokenPayload
      context.profile = await this.graphQLAuthorization()
    }

    if (Ctx.type === ContextType.socketContext) {
      const { socket } = Ctx.switchToSocket()
      this.tokenPayload = socket.tokenPayload
      socket.profile = await this.socketAuthorization()
    }

    return true
  }

  private readonly hasChangedCredentials = (): boolean => {
    const { iat } = this.tokenPayload

    if (!this.changedCredentialsAt) return false

    return iat < Math.ceil(this.changedCredentialsAt.getTime() / 1000)
  }

  private readonly httpAuthorization = async () => {
    this.tokenPayload = this.tokenPayload

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
        "avatar.public_id": 0,
        "avatar.folderPath": 0,
      },
      populate: [
        {
          path: "posts",
          select: {
            "attachments.paths.public_id": 0,
            "attachments.folderId": 0,
            "attachments.fullPath": 0,
          },
          populate: [
            {
              path: "createdBy",
              select: {
                "avatar.secure_url": 1,
                username: 1,
              },
            },
            {
              path: "onCommunity",
              select: {
                "cover.path.secure_url": 1,
                slug: 1,
                name: 1,
              },
              options: { lean: true },
            },
            {
              path: "comments",
              select: {
                body: 1,
                createdBy: 1,
              },
              populate: [
                {
                  path: "createdBy",
                  select: { avatar: 1, username: 1 },
                  options: { lean: true },
                },
              ],
            },
          ],
        },

        {
          path: "joinedCommunities",
          select: {
            "cover.path.secure_url": 1,
            slug: 1,
            name: 1,
          },
          options: { lean: true },
        },
      ],
    })

    if (!isExistedUser)
      return throwError({ msg: "un-authenticated user", status: 403 })

    this.changedCredentialsAt = isExistedUser.changedCredentialsAt

    if (this.hasChangedCredentials())
      return throwError({ msg: "re-login is required", status: 403 })

    return isExistedUser
  }

  private readonly graphQLAuthorization = async () => {
    this.tokenPayload = this.tokenPayload

    const isExistedUser = await this.userRepository.findOne({
      filter: {
        $and: [
          { _id: this.tokenPayload._id },
          { deactivatedAt: { $exists: false } },
        ],
      },
      projection: { password: 0, oldPasswords: 0 },
      populate: [{ path: "posts" }],
      options: { lean: true },
    })

    if (!isExistedUser)
      return throwError({ msg: "un-authenticated user", status: 403 })

    this.changedCredentialsAt = isExistedUser.changedCredentialsAt

    if (this.hasChangedCredentials())
      return throwError({ msg: "re-login is required", status: 403 })

    return isExistedUser
  }

  private readonly socketAuthorization = async () => {
    this.tokenPayload = this.tokenPayload

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
        "avatar.secure_url": 1,
      },
      options: { lean: true },
    })

    if (!isExistedUser)
      return throwError({
        msg: "Account not found, try to register",
        status: 401,
      })

    this.changedCredentialsAt = isExistedUser.changedCredentialsAt

    if (this.hasChangedCredentials())
      return throwError({
        msg: "Login Timed out, Try to login again",
        status: 440,
      })

    return isExistedUser
  }
}

export default new IsAuthorizedGuard()
