import joi from 'joi'

import * as DTO from '../dto/reply.dto'

import { generalFields } from '../../../common/validation/general-fields'
import { isValidMongoId } from '../../../common/validation/is-valid'
import { IReplyInputs } from '../../../db/interfaces/IReply.interface'

export const getCommentRepliesValidator = {
  schema: joi
    .object<DTO.IGetCommentReplies>()
    .keys({
      commentId: generalFields.mongoId.required(),
    })
    .required(),

  http() {
    return {
      params: this.schema.required().messages({
        'any.required': 'comment id param is required',
      }),
    }
  },

  graphql() {
    return {
      args: this.schema.required().messages({
        'any.required': 'comment id arg is required',
      }),
    }
  },
}

export const addValidator = {
  schema: {
    params: {
      commentId: joi.string().custom(isValidMongoId).required(),
    },
    body: {
      content: generalFields.content.max(250).required(),
    },
  },

  http() {
    return {
      params: joi.object().keys(this.schema.params).required().messages({
        'any.required':
          '[/reply/commentId] "commentId" is Expected but got nothing',
      }),
      body: joi
        .object<DTO.IAddReply>()
        .keys(this.schema.body)
        .required()
        .messages({
          'any.required': '"reply" body is required',
        }),
    }
  },

  graphql() {
    return {
      args: joi
        .object<DTO.IAddReply>()
        .keys({ ...this.schema.body, ...this.schema.params })
        .required()
        .messages({
          'any.required': 'addComment args is required',
        }),
    }
  },
}

export const editValidator = {
  schema: {
    query: {
      replyId: joi.string().custom(isValidMongoId).required(),
    },
    body: {
      content: generalFields.content.max(250).required(),
    },
  },

  http() {
    return {
      query: joi
        .object<DTO.IReplyId>()
        .keys(this.schema.query)
        .required()
        .messages({
          'any.required':
            '[/reply/replyId] "replyId" is Expected but got nothing',
        }),
      body: joi
        .object<Pick<IReplyInputs, 'content'>>()
        .keys(this.schema.body)
        .required()
        .messages({
          'any.required': 'addComment body is required',
        }),
    }
  },

  graphql() {
    return {
      args: joi
        .object<DTO.IEditReply>()
        .keys({ ...this.schema.body, ...this.schema.query })
        .required()
        .messages({
          'any.required': 'editComment args is required',
        }),
    }
  },
}

export const deleteValidator = {
  schema: {
    params: {
      replyId: joi.string().custom(isValidMongoId).required(),
    },
  },

  http() {
    return {
      params: joi
        .object<DTO.IDeleteReply>()
        .keys(this.schema.params)
        .required()
        .messages({
          'any.required':
            '[/reply/replyId] "commentId" is Expected but got nothing',
        }),
    }
  },

  graphql() {
    return {
      args: joi
        .object<DTO.IDeleteReply>()
        .keys(this.schema.params)
        .required()
        .messages({
          'any.required': 'commentId is Expected but Got Nothing',
        }),
    }
  },
}

export const likeValidator = {
  schema: {
    query: {
      replyId: joi.string().custom(isValidMongoId).required(),
    },
  },

  http() {
    return {
      query: joi
        .object<DTO.ILikeReply>()
        .keys(this.schema.query)
        .required()
        .messages({
          'any.required':
            '[/reply/replyId] "replyId" is Expected but got nothing',
        }),
    }
  },

  graphql() {
    return {
      args: joi
        .object<DTO.ILikeReply>()
        .keys(this.schema.query)
        .required()
        .messages({
          'any.required': 'commentId is Expected but Got Nothing',
        }),
    }
  },
}
