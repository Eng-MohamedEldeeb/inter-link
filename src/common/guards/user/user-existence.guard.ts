import { ContextType } from "../../decorators/context/types"
import { throwError } from "../../handlers/error-message.handler"
import { GuardActivator } from "../../decorators/guard/guard-activator.guard"
import { IGetUserProfile } from "../../../modules/apis/user/dto/user.dto"
import { ContextDetector } from "../../decorators/context/context-detector.decorator"
import { MongoId } from "../../types/db"

import {
  IAddAdmin,
  IRemoveAdmin,
} from "../../../modules/apis/community/dto/community.dto"

import {
  GraphQLParams,
  HttpParams,
  SocketServerParams,
} from "../../decorators/context/types"

import { userRepository } from "../../../db/repositories"

class UserExistenceGuard extends GuardActivator {
  private readonly userRepository = userRepository
  private username: string | undefined
  private adminId!: MongoId | string
  private user_id!: MongoId | string

  async canActivate(
    ...params: HttpParams | GraphQLParams | SocketServerParams
  ) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<
        Pick<IGetUserProfile, "user_id">,
        IGetUserProfile & IAddAdmin & IRemoveAdmin
      >()

      const { username, user_id, adminId } = {
        ...req.query,
        ...req.params,
        ...(req.chat && { user_id: req.chat.participants[0] }),
      }

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

      console.log({ user_id })

      if (!user_id)
        return throwError({ msg: "user_id is required in query param" })

      this.user_id = user_id as string

      socket.user = await this.checkUserExistence()
    }

    return true
  }

  private readonly checkUserExistence = async () => {
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
                  { _id: this.user_id },
                  { deactivatedAt: { $exists: false } },
                ],
              }),
      },
      projection: {
        phone: 0,
        password: 0,
        oldPasswords: 0,
        "avatar.public_id": 0,
        "avatar.folderPath": 0,
        blockedUsers: 0,
        savedPosts: 0,
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
      return throwError({
        msg: "User not found",
        status: 404,
      })

    return isExistedUser
  }
}

export default new UserExistenceGuard()
