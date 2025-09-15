import joi from "joi"

import * as DTO from "../modules/apis/post/dto/post.dto"
import { Validator } from "../common/utils/validator/validator"

export class PostValidator extends Validator {
  public static readonly getAllValidator = {
    schema: joi.object<DTO.IGetAll>().keys({
      page: joi.string().custom(this.isValidNumericString("page")).messages({
        "string.base": "enter a valid page number",
      }),
      limit: joi.string().custom(this.isValidNumericString("limit")).messages({
        "string.base": "enter a valid limit number",
      }),
    }),

    http() {
      return {
        query: this.schema,
      }
    },

    graphql() {
      return {
        args: this.schema,
      }
    },
  }

  public static readonly getSingleValidator = {
    schema: joi
      .object<DTO.IGetSinglePost>()
      .keys({
        id: this.generalFields.mongoId.required(),
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

  public static readonly createValidator = {
    body: joi
      .object<DTO.ICreatePost>()
      .keys({
        title: this.generalFields.content.min(1).max(50).required(),
        content: this.generalFields.content.max(500),
        onCommunity: this.generalFields.mongoId,
      })
      .required(),
  }

  public static readonly editValidator = {
    schema: {
      body: {
        title: this.generalFields.content.min(1).when(joi.ref("content"), {
          is: joi.exist(),
          then: joi.optional(),
          otherwise: joi.required(),
        }),
        content: this.generalFields.content.max(500),
      },

      query: {
        id: this.generalFields.mongoId.required(),
      },
    },

    http() {
      return {
        body: joi.object<DTO.IEditPost>().keys(this.schema.body).required(),
        query: joi
          .object<DTO.IGetSinglePost>()
          .keys(this.schema.query)
          .required(),
      }
    },

    graphql() {
      return {
        args: joi
          .object<DTO.IEditPost>()
          .keys({ ...this.schema.query, ...this.schema.body })
          .required(),
      }
    },
  }

  public static readonly saveValidator = {
    schema: joi
      .object<DTO.IGetSinglePost>()
      .keys({
        id: this.generalFields.mongoId.required(),
      })
      .required(),

    http() {
      return {
        query: this.schema.required(),
      }
    },

    graphql() {
      return {
        args: this.schema.required(),
      }
    },
  }

  public static readonly sharedValidator = {
    schema: joi
      .object<DTO.IGetSinglePost>()
      .keys({
        id: this.generalFields.mongoId.required(),
      })
      .required(),

    http() {
      return {
        query: this.schema.required(),
      }
    },

    graphql() {
      return {
        args: this.schema.required(),
      }
    },
  }

  public static readonly likeValidator = {
    schema: joi
      .object<DTO.ILikePost>()
      .keys({
        id: this.generalFields.mongoId.required(),
      })
      .required(),

    http() {
      return {
        query: this.schema.required(),
      }
    },

    graphql() {
      return {
        args: this.schema.required(),
      }
    },
  }

  public static readonly archiveValidator = {
    schema: joi
      .object<DTO.IGetSinglePost>()
      .keys({
        id: this.generalFields.mongoId.required(),
      })
      .required(),

    http() {
      return {
        query: this.schema.required(),
      }
    },

    graphql() {
      return {
        args: this.schema.required(),
      }
    },
  }

  public static readonly restoreValidator = {
    schema: joi
      .object<DTO.IGetSinglePost>()
      .keys({
        id: this.generalFields.mongoId.required(),
      })
      .required(),

    http() {
      return {
        query: this.schema.required(),
      }
    },

    graphql() {
      return {
        args: this.schema.required(),
      }
    },
  }

  public static readonly deleteValidator = {
    schema: joi
      .object<DTO.IGetSinglePost>()
      .keys({
        id: this.generalFields.mongoId.required(),
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
}
