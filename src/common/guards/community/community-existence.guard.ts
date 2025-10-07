import { GuardActivator } from "../../decorators/guard/guard-activator.guard"
import { ContextDetector } from "../../decorators/context/context-detector.decorator"
import { ContextType } from "../../decorators/context/types"
import { IGetCommunity } from "../../../modules/apis/community/dto/community.dto"
import { throwError } from "../../handlers/error-message.handler"
import { MongoId } from "../../types/db"

import { GraphQLParams, HttpParams } from "../../decorators/context/types"

import { communityRepository } from "../../../db/repositories"

class CommunityExistenceGuard extends GuardActivator {
  private readonly communityRepository = communityRepository
  private communityId!: MongoId

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetCommunity, IGetCommunity>()
      const { communityId } = { ...req.params, ...req.query }

      this.communityId = communityId

      req.community = await this.getCommunityInformation()
    }

    if (Ctx.type === ContextType.graphContext) {
      const { args, context } = Ctx.switchToGraphQL<IGetCommunity>()
      const { communityId } = args

      this.communityId = communityId

      context.community = await this.getCommunityInformation()
    }

    return true
  }

  private readonly getCommunityInformation = async () => {
    const isExistedCommunity = await this.communityRepository.findOne({
      filter: { _id: this.communityId },
      projection: { "cover.path.public_id": 0 },
      populate: [
        {
          path: "posts",
          options: { sort: { createdAt: -1 } },
          populate: [
            {
              path: "createdBy",
              select: {
                username: 1,
                "avatar.secure_url": 1,
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
            {
              path: "createdBy",
              select: { avatar: 1, username: 1 },
              options: { lean: true },
            },
          ],
        },
        {
          path: "members",
          select: {
            username: 1,
            "avatar.secure_url": 1,
          },
          options: { lean: true },
        },
        {
          path: "admins",
          select: {
            username: 1,
            "avatar.secure_url": 1,
          },
          options: { lean: true },
        },
        {
          path: "createdBy",
          select: {
            username: 1,
            "avatar.secure_url": 1,
          },
          options: { lean: true },
        },
      ],
    })

    if (!isExistedCommunity)
      return throwError({
        msg: "Un-Existed Community or Invalid Id",
        status: 404,
      })

    return isExistedCommunity
  }
}

export default new CommunityExistenceGuard()
