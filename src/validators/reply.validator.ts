import joi from "joi"

import * as DTO from "../modules/reply/dto/reply.dto"

import { IReplyInputs } from "../db/interfaces/IReply.interface"
import { Validator } from "../common/utils/validator/validator"

export class ReplyValidator extends Validator {
  public static readonly getCommentRepliesValidator = {
    schema: joi
      .object<DTO.IGetCommentReplies>()
      .keys({
        commentId: this.generalFields.mongoId.required(),
      })
      .required(),

    http() {
      return {
        params: this.schema.required(),
      }
    },

    graphql() {
      return {
        args: this.schema.required(),
      }
    },
  }

  public static readonly addValidator = {
    schema: {
      params: {
        commentId: joi.string().custom(this.isValidMongoId).required(),
      },
      body: {
        content: this.generalFields.content.max(250).required(),
      },
    },

    http() {
      return {
        params: joi.object().keys(this.schema.params).required(),
        body: joi.object<DTO.IAddReply>().keys(this.schema.body).required(),
      }
    },

    graphql() {
      return {
        args: joi
          .object<DTO.IAddReply>()
          .keys({ ...this.schema.body, ...this.schema.params })
          .required(),
      }
    },
  }

  public static readonly editValidator = {
    schema: {
      query: {
        replyId: joi.string().custom(this.isValidMongoId).required(),
      },
      body: {
        content: this.generalFields.content.max(250).required(),
      },
    },

    http() {
      return {
        query: joi.object<DTO.IReplyId>().keys(this.schema.query).required(),
        body: joi
          .object<Pick<IReplyInputs, "content">>()
          .keys(this.schema.body)
          .required(),
      }
    },

    graphql() {
      return {
        args: joi
          .object<DTO.IEditReply>()
          .keys({ ...this.schema.body, ...this.schema.query })
          .required(),
      }
    },
  }

  public static readonly deleteValidator = {
    schema: {
      params: {
        replyId: joi.string().custom(this.isValidMongoId).required(),
      },
    },

    http() {
      return {
        params: joi
          .object<DTO.IDeleteReply>()
          .keys(this.schema.params)
          .required(),
      }
    },

    graphql() {
      return {
        args: joi
          .object<DTO.IDeleteReply>()
          .keys(this.schema.params)
          .required(),
      }
    },
  }

  public static readonly likeValidator = {
    schema: {
      query: {
        replyId: joi.string().custom(this.isValidMongoId).required(),
      },
    },

    http() {
      return {
        query: joi.object<DTO.ILikeReply>().keys(this.schema.query).required(),
      }
    },

    graphql() {
      return {
        args: joi.object<DTO.ILikeReply>().keys(this.schema.query).required(),
      }
    },
  }
}
