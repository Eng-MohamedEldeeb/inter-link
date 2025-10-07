import { GuardActivator } from "../../decorators/guard/guard-activator.guard"
import { ContextDetector } from "../../decorators/context/context-detector.decorator"
import { ContextType } from "../../decorators/context/types"
import { throwError } from "../../handlers/error-message.handler"

import {
  IGetSinglePost,
  IPostId,
} from "../../../modules/apis/post/dto/post.dto"

import { GraphQLParams, HttpParams } from "../../decorators/context/types"

import { postRepository } from "../../../db/repositories"
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
      projection: {
        savedBy: 0,
        "attachments.folderId": 0,
        "attachments.fullPath": 0,
        "attachments.paths.public_id": 0,
      },

      populate: [
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
        {
          path: "createdBy",
          select: { avatar: 1, username: 1 },
          options: { lean: true },
        },
      ],
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
