import { GuardActivator } from "../../decorators/guard/guard-activator.guard"
import { ContextDetector } from "../../decorators/context/context-detector.decorator"
import { ContextType } from "../../decorators/context/types"
import { throwError } from "../../handlers/error-message.handler"

import {
  IGetCommunity,
  IRemovePost,
} from "../../../modules/apis/community/dto/community.dto"

import { GraphQLParams, HttpParams } from "../../decorators/context/types"

import { postRepository } from "../../../db/repositories"
import { MongoId } from "../../types/db"

class PostExistenceInCommunityGuard extends GuardActivator {
  private readonly postRepository = postRepository
  private communityName!: string
  private communityId!: MongoId
  private postId!: MongoId

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetCommunity, IRemovePost>()
      const { _id: communityId, name } = req.community
      const { postId } = req.query

      this.communityName = name
      this.communityId = communityId
      this.postId = postId

      req.post = await this.getPostFromCommunity()
    }

    if (Ctx.type === ContextType.graphContext) {
      const { args, context } = Ctx.switchToGraphQL<
        IGetCommunity & IRemovePost
      >()
      const { _id: communityId, name } = context.community
      const { postId } = args

      this.communityName = name
      this.communityId = communityId
      this.postId = postId

      context.post = await this.getPostFromCommunity()
    }

    return true
  }

  private readonly getPostFromCommunity = async () => {
    const isExistedInCommunity = await this.postRepository.findOne({
      filter: {
        $and: [
          { _id: this.postId },
          { onCommunity: this.communityId },
          { archivedAt: { $exists: false } },
        ],
      },
    })

    if (!isExistedInCommunity)
      return throwError({
        msg: `Post Doesn't exist in '${this.communityName}' community`,
        status: 404,
      })
    return isExistedInCommunity
  }
}

export default new PostExistenceInCommunityGuard()
