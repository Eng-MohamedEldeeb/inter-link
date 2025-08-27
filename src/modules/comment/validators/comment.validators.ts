import joi from 'joi'

import * as DTO from '../dto/comment.dto'

import { generalFields } from '../../../common/validation/general-fields'
import { isValidMongoId } from '../../../common/validation/is-valid'

export const getSingleCommentValidator = {
  schema: joi
    .object<DTO.IGetSingleComment>()
    .keys({
      id: generalFields.mongoId
        .required()
        .messages({ 'string.base': 'In-valid commentId' }),
    })
    .required(),

  http() {
    return {
      params: this.schema.required().messages({
        'any.required': 'commentId param is required',
      }),
    }
  },

  graphql() {
    return {
      args: this.schema.required().messages({
        'any.required': 'commentId arg is required',
      }),
    }
  },
}

export const addValidator = {
  schema: {
    params: {
      postId: joi.string().custom(isValidMongoId).required(),
    },
    body: {
      content: generalFields.content.max(250).required(),
    },
  },

  http() {
    return {
      params: joi.object().keys(this.schema.params).required().messages({
        'any.required':
          '[/postId/comments] "postId" is Expected but got nothing',
      }),
      body: joi
        .object<DTO.IAddComment>()
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
        .object<DTO.IAddComment>()
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
      id: joi.string().custom(isValidMongoId).required(),
    },
    body: {
      content: generalFields.content.max(250).required(),
    },
  },

  http() {
    return {
      query: joi
        .object<DTO.IEditComment>()
        .keys(this.schema.query)
        .required()
        .messages({
          'any.required':
            '[/edit?id=id] "commentId" is Expected but got nothing',
        }),
      body: joi.object().keys(this.schema.body).required().messages({
        'any.required': 'addComment body is required',
      }),
    }
  },

  graphql() {
    return {
      args: joi
        .object<DTO.IEditComment>()
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
      id: joi.string().custom(isValidMongoId).required(),
    },
  },

  http() {
    return {
      params: joi
        .object<DTO.IDeleteComment>()
        .keys(this.schema.params)
        .required()
        .messages({
          'any.required':
            '[/comments/commentId] "commentId" is Expected but got nothing',
        }),
    }
  },

  graphql() {
    return {
      args: joi
        .object<DTO.IDeleteComment>()
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
      id: joi.string().custom(isValidMongoId).required(),
    },
  },

  http() {
    return {
      query: joi
        .object<DTO.ILikeComment>()
        .keys(this.schema.query)
        .required()
        .messages({
          'any.required': '[/comments?id=id] "id" is Expected but got nothing',
        }),
    }
  },

  graphql() {
    return {
      args: joi
        .object<DTO.IDeleteComment>()
        .keys(this.schema.query)
        .required()
        .messages({
          'any.required': 'commentId is Expected but Got Nothing',
        }),
    }
  },
}
