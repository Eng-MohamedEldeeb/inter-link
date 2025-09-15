import joi from "joi"

import * as DTO from "../modules/apis/comment/dto/comment.dto"
import { Validator } from "../common/utils/validator/validator"

export class CommentValidator extends Validator {
  public static readonly getSingleCommentValidator = {
    schema: joi
      .object<DTO.IGetSingleComment>()
      .keys({
        id: this.generalFields.mongoId
          .required()
          .messages({ "string.base": "Invalid commentId" }),
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
        postId: joi.string().custom(this.isValidMongoId).required(),
      },
      body: {
        content: this.generalFields.content.max(250).required(),
      },
    },

    http() {
      return {
        params: joi.object().keys(this.schema.params).required(),
        body: joi.object<DTO.IAddComment>().keys(this.schema.body).required(),
      }
    },

    graphql() {
      return {
        args: joi
          .object<DTO.IAddComment>()
          .keys({ ...this.schema.body, ...this.schema.params })
          .required(),
      }
    },
  }
  public static readonly editValidator = {
    schema: {
      query: {
        id: joi.string().custom(this.isValidMongoId).required(),
      },
      body: {
        content: this.generalFields.content.max(250).required(),
      },
    },

    http() {
      return {
        query: joi
          .object<DTO.IEditComment>()
          .keys(this.schema.query)
          .required(),
        body: joi.object().keys(this.schema.body).required(),
      }
    },

    graphql() {
      return {
        args: joi
          .object<DTO.IEditComment>()
          .keys({ ...this.schema.body, ...this.schema.query })
          .required(),
      }
    },
  }

  public static readonly deleteValidator = {
    schema: {
      params: {
        id: joi.string().custom(this.isValidMongoId).required(),
      },
    },

    http() {
      return {
        params: joi
          .object<DTO.IDeleteComment>()
          .keys(this.schema.params)
          .required(),
      }
    },

    graphql() {
      return {
        args: joi
          .object<DTO.IDeleteComment>()
          .keys(this.schema.params)
          .required(),
      }
    },
  }

  public static readonly likeValidator = {
    schema: {
      query: {
        id: joi.string().custom(this.isValidMongoId).required(),
      },
    },

    http() {
      return {
        query: joi
          .object<DTO.ILikeComment>()
          .keys(this.schema.query)
          .required(),
      }
    },

    graphql() {
      return {
        args: joi
          .object<DTO.IDeleteComment>()
          .keys(this.schema.query)
          .required(),
      }
    },
  }
}
