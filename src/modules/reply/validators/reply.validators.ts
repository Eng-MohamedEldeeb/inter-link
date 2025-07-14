import joi from 'joi'
import { generalFields } from '../../../common/validation/general-fields'
import {
  IAddReplyDTO,
  IDeleteReplyDTO,
  IEditReplyDTO,
  IGetCommentRepliesDTO,
  IReplyIdDTO,
} from '../dto/reply.dto'
import { isValidMongoId } from '../../../common/validation/is-valid'
import { IReplyInputs } from '../../../db/interface/IReply.interface'

export const getCommentRepliesValidator = {
  schema: joi
    .object<IGetCommentRepliesDTO>()
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

  graphQL() {
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
      replyingTo: joi.string().custom(isValidMongoId),
    },
  },

  http() {
    return {
      params: joi.object().keys(this.schema.params).required().messages({
        'any.required':
          '[/commentId/reply] "commentId" is Expected but got nothing',
      }),
      body: joi
        .object<IAddReplyDTO>()
        .keys(this.schema.body)
        .required()
        .messages({
          'any.required': '"reply" body is required',
        }),
    }
  },

  graphQL() {
    return {
      args: joi
        .object<IAddReplyDTO>()
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
      replyId: joi.string().custom(isValidMongoId).required(),
    },
    body: {
      content: generalFields.content.max(250).required(),
    },
  },

  http() {
    return {
      params: joi
        .object<IReplyIdDTO>()
        .keys(this.schema.params)
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

  graphQL() {
    return {
      args: joi
        .object<IEditReplyDTO>()
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
      replyId: joi.string().custom(isValidMongoId).required(),
    },
  },

  http() {
    return {
      params: joi
        .object<IDeleteReplyDTO>()
        .keys(this.schema.params)
        .required()
        .messages({
          'any.required':
            '[/reply/replyId] "commentId" is Expected but got nothing',
        }),
    }
  },

  graphQL() {
    return {
      args: joi
        .object<IDeleteReplyDTO>()
        .keys(this.schema.params)
        .required()
        .messages({
          'any.required': 'commentId is Expected but Got Nothing',
        }),
    }
  },
}
