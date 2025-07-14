import joi from 'joi'
import { generalFields } from '../../../common/validation/general-fields'
import {
  IAddCommentDTO,
  ICommentIdDTO,
  IDeleteCommentDTO,
  IEditCommentDTO,
} from '../dto/comment.dto'
import { isValidMongoId } from '../../../common/validation/is-valid'

export const getSingleCommentValidator = {
  schema: joi
    .object<ICommentIdDTO>()
    .keys({
      commentId: generalFields.mongoId
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

  graphQL() {
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
      onPost: joi.string().custom(isValidMongoId),
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
        .object<IAddCommentDTO>()
        .keys(this.schema.body)
        .required()
        .messages({
          'any.required': 'addComment body is required',
        }),
    }
  },

  graphQL() {
    return {
      args: joi
        .object<IAddCommentDTO>()
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
    params: {
      commentId: joi.string().custom(isValidMongoId).required(),
    },
    body: {
      content: generalFields.content.max(250).required(),
    },
  },

  http() {
    return {
      params: joi
        .object<IEditCommentDTO>()
        .keys(this.schema.params)
        .required()
        .messages({
          'any.required':
            '[/comments/commentId] "commentId" is Expected but got nothing',
        }),
      body: joi.object().keys(this.schema.body).required().messages({
        'any.required': 'addComment body is required',
      }),
    }
  },

  graphQL() {
    return {
      args: joi
        .object<IEditCommentDTO>()
        .keys({ ...this.schema.body, ...this.schema.params })
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
      commentId: joi.string().custom(isValidMongoId).required(),
    },
  },

  http() {
    return {
      params: joi
        .object<IDeleteCommentDTO>()
        .keys(this.schema.params)
        .required()
        .messages({
          'any.required':
            '[/comments/commentId] "commentId" is Expected but got nothing',
        }),
    }
  },

  graphQL() {
    return {
      args: joi
        .object<IDeleteCommentDTO>()
        .keys(this.schema.params)
        .required()
        .messages({
          'any.required': 'commentId is Expected but Got Nothing',
        }),
    }
  },
}
