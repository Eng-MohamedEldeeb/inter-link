import { GuardActivator } from "../../decorators/guard/guard-activator.guard"
import { ContextDetector } from "../../decorators/context/context-detector.decorator"
import { ContextType } from "../../decorators/context/types"
import { throwError } from "../../handlers/error-message.handler"

import { IGetSinglePost, IPostId } from "../../../modules/post/dto/post.dto"

import { GraphQLParams, HttpParams } from "../../decorators/context/types"

import postRepository from "../../repositories/concrete/post.repository"
import { MongoId } from "../../types/db"

class PostExistenceGuard extends GuardActivator {
  private readonly postRepository = postRepository
  private postId!: MongoId
  private id!: MongoId

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<
        IGetSinglePost & IPostId,
        IGetSinglePost
      >()
      const { id, postId } = { ...req.params, ...req.query }

      this.postId = postId
      this.id = id

      req.post = await this.getPost()
    }

    if (Ctx.type === ContextType.graphContext) {
      const { args, context } = Ctx.switchToGraphQL<IGetSinglePost & IPostId>()
      const { id, postId } = args

      this.postId = postId
      this.id = id

      context.post = await this.getPost()
    }

    return true
  }

  private readonly getPost = async () => {
    const isExistedPost = await this.postRepository.findOne({
      filter: {
        $and: [
          { $or: [{ _id: this.id }, { _id: this.postId }] },
          { archivedAt: { $exists: false } },
        ],
      },
      projection: { savedBy: 0 },
      populate: [{ path: "comments" }],
    })

    if (!isExistedPost)
      return throwError({
        msg: "Un-Existed Post or Invalid Id",
        status: 404,
      })
    return isExistedPost
  }
}

export default new PostExistenceGuard()
