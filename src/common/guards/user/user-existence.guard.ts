import { ContextType } from "../../decorators/context/types"
import { throwError } from "../../handlers/error-message.handler"
import { GuardActivator } from "../../decorators/guard/guard-activator.guard"
import { IGetUserProfile } from "../../../modules/user/dto/user.dto"
import { ContextDetector } from "../../decorators/context/context-detector.decorator"
import { MongoId } from "../../types/db"

import {
  IAddAdmin,
  IRemoveAdmin,
} from "../../../modules/community/dto/community.dto"

import {
  GraphQLParams,
  HttpParams,
  SocketServerParams,
} from "../../decorators/context/types"

import userRepository from "../../repositories/user.repository"

class UserExistenceGuard extends GuardActivator {
  protected readonly userRepository = userRepository
  protected username: string | undefined
  protected userId!: MongoId | string
  protected adminId!: MongoId | string
  protected user_id!: MongoId | string

  async canActivate(
    ...params: HttpParams | GraphQLParams | SocketServerParams
  ) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<
        Pick<IGetUserProfile, "user_id">,
        IGetUserProfile & IAddAdmin & IRemoveAdmin
      >()

      const { username, user_id, adminId } = { ...req.query, ...req.params }
      const { _id: profileId } = req.profile

      this.username = username
      this.adminId = adminId
      this.user_id = user_id

      const user = await this.checkUserExistence()

      if (user._id.equals(profileId)) {
        req.user = user
        return true
      }

      req.user = user
    }

    if (Ctx.type === ContextType.graphContext) {
      const { args, context } = Ctx.switchToGraphQL<
        IGetUserProfile & IAddAdmin & IRemoveAdmin
      >()

      const { username, user_id, adminId } = args

      this.username = username
      this.adminId = adminId
      this.user_id = user_id

      context.user = await this.checkUserExistence()
    }

    if (Ctx.type === ContextType.socketContext) {
      const { socket } = Ctx.switchToSocket()

      const { user_id } = socket.handshake.query

      if (!user_id)
        return throwError({ msg: "user_id is required in query param" })

      this.user_id = user_id as string

      socket.user = await this.checkUserExistence()
    }

    return true
  }

  protected readonly checkUserExistence = async () => {
    const isExistedUser = await this.userRepository.findOne({
      filter: {
        ...(this.username
          ? {
              $and: [
                { username: { $regex: this.username } },

                {
                  deactivatedAt: { $exists: false },
                },
              ],
            }
          : this.adminId
            ? {
                $and: [
                  { _id: this.adminId },
                  { deactivatedAt: { $exists: false } },
                ],
              }
            : {
                $and: [
                  { $or: [{ _id: this.user_id }, { _id: this.userId }] },
                  { deactivatedAt: { $exists: false } },
                ],
              }),
      },
      populate: [{ path: "posts" }],
      projection: {
        phone: 0,
        password: 0,
        oldPasswords: 0,
        "avatar.public_id": 0,
        "avatar.folderPath": 0,
        blockedUsers: 0,
        savedPosts: 0,
      },
    })

    if (!isExistedUser)
      return throwError({
        msg: "User not found",
        status: 404,
      })

    return isExistedUser
  }
}

export default new UserExistenceGuard()
