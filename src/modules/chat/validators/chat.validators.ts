import joi from 'joi'

import * as DTO from '../dto/chat.dto'

import { generalFields } from '../../../common/validation/general-fields'

export const getSingleChatValidator = {
  schema: joi
    .object<DTO.IGetSingleChat>()
    .keys({
      chatId: generalFields.mongoId.required(),
    })
    .required(),

  http() {
    return {
      params: this.schema.required().messages({
        'any.required': 'userId query param is required',
      }),
    }
  },

  graphQL() {
    return {
      args: this.schema.required().messages({
        'any.required': 'userId arg is required',
      }),
    }
  },
}
export const startChatValidator = {
  query: {
    userId: generalFields.mongoId.required(),
  },

  body: {
    message: generalFields.content.required(),
  },

  http() {
    return {
      query: joi.object<DTO.IStartChat>().keys(this.query).required().messages({
        'any.required': 'userId query param is required',
      }),
      body: joi.object<DTO.IStartChat>().keys(this.body).required().messages({
        'any.required': 'message is required',
      }),
    }
  },

  graphQL() {
    return {
      args: joi
        .object<DTO.IStartChat>()
        .keys({ ...this.query, ...this.body })
        .required()
        .messages({
          'any.required': 'message and userId args are required',
        }),
    }
  },
}

export const likeMessageValidator = {
  params: {
    chatId: generalFields.mongoId.required(),
  },

  query: {
    messageId: generalFields.mongoId.required(),
  },

  http() {
    return {
      params: joi
        .object<Pick<DTO.ILikeMessage, 'chatId'>>()
        .keys(this.params)
        .required()
        .messages({
          'any.required': 'chatId param is required',
        }),

      query: joi
        .object<Pick<DTO.ILikeMessage, 'messageId'>>()
        .keys(this.query)
        .required()
        .messages({
          'any.required': 'messageId query param is required',
        }),
    }
  },

  graphQL() {
    return {
      args: joi
        .object<DTO.ILikeMessage>()
        .keys({ ...this.query, ...this.params })
        .required()
        .messages({
          'any.required': 'messageId and chatId args are required',
        }),
    }
  },
}

export const deleteMessageValidator = {
  params: {
    chatId: generalFields.mongoId.required(),
  },

  query: {
    messageId: generalFields.mongoId.required(),
  },

  http() {
    return {
      params: joi
        .object<Pick<DTO.ILikeMessage, 'chatId'>>()
        .keys(this.params)
        .required()
        .messages({
          'any.required': 'chatId param and messageId query param is required',
        }),

      query: joi
        .object<Pick<DTO.ILikeMessage, 'messageId'>>()
        .keys(this.query)
        .required()
        .messages({
          'any.required': 'chatId and messageId is required',
        }),
    }
  },

  graphQL() {
    return {
      args: joi
        .object<DTO.ILikeMessage>()
        .keys({ ...this.query, ...this.params })
        .required()
        .messages({
          'any.required': 'messageId and chatId args are required',
        }),
    }
  },
}
export const deleteChatValidator = {
  schema: joi
    .object<DTO.IDeleteChat>()
    .keys({
      chatId: generalFields.mongoId.required(),
    })
    .required(),

  http() {
    return {
      query: this.schema.required().messages({
        'any.required': 'chatId  param is required',
      }),
    }
  },

  graphQL() {
    return {
      args: this.schema.required().messages({
        'any.required': 'chatId arg is required',
      }),
    }
  },
}
