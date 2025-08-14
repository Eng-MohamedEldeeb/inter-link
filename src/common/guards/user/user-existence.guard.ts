import { ContextType } from '../../decorators/context/types'
import { throwError } from '../../handlers/error-message.handler'
import { GuardActivator } from '../class/guard-activator.class'
import { IGetUserProfile } from '../../../modules/user/dto/user.dto'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { MongoId } from '../../types/db'

import {
  IAddAdmin,
  IRemoveAdmin,
} from '../../../modules/community/dto/community.dto'

import {
  GraphQLParams,
  HttpParams,
  SocketServerParams,
} from '../../decorators/context/types'

import userRepository from '../../repositories/user.repository'

class UserExistenceGuard extends GuardActivator {
  protected readonly userRepository = userRepository
  protected username: string | undefined
  protected userId!: MongoId | string
  protected adminId!: MongoId | string
  protected id!: MongoId | string

  async canActivate(
    ...params: HttpParams | GraphQLParams | SocketServerParams
  ) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<
        Pick<IGetUserProfile, 'id'>,
        IGetUserProfile & IAddAdmin & IRemoveAdmin
      >()

      const { username, id, userId, adminId } = { ...req.query, ...req.params }
      const { _id: profileId } = req.profile

      this.username = username
      this.userId = userId
      this.adminId = adminId
      this.id = id

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

      const { username, id, userId, adminId } = args

      this.username = username
      this.adminId = adminId
      this.userId = userId
      this.id = id

      context.user = await this.checkUserExistence()
    }

    if (Ctx.type === ContextType.socketContext) {
      const { socket } = Ctx.switchToSocket()

      const { id } = socket.handshake.query

      if (!id)
        return throwError({ msg: 'user id is required in id query param' })

      this.id = id as string

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
                  { $or: [{ _id: this.id }, { _id: this.userId }] },
                  { deactivatedAt: { $exists: false } },
                ],
              }),
      },
      populate: [{ path: 'posts' }],
      projection: {
        phone: 0,
        password: 0,
        oldPasswords: 0,
        'avatar.public_id': 0,
        'avatar.folderPath': 0,
        blockedUsers: 0,
        savedPosts: 0,
      },
    })

    if (!isExistedUser)
      return throwError({
        msg: "user doesn't exist",
        status: 400,
      })

    return isExistedUser
  }
}

export default new UserExistenceGuard()
