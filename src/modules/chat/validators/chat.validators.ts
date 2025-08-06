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

export const editMessageValidator = {
  params: {
    chatId: generalFields.mongoId.required(),
  },

  query: {
    messageId: generalFields.mongoId.required(),
  },

  body: {
    newMessage: joi.string().max(700).required(),
  },

  http() {
    return {
      params: joi
        .object<Pick<DTO.IEditMessage, 'chatId'>>()
        .keys(this.params)
        .required()
        .messages({
          'any.required': 'chatId param and messageId query param is required',
        }),

      query: joi
        .object<Pick<DTO.IEditMessage, 'messageId'>>()
        .keys(this.query)
        .required()
        .messages({
          'any.required': 'chatId and messageId is required',
        }),

      body: joi
        .object<Pick<DTO.IEditMessage, 'newMessage'>>()
        .keys(this.body)
        .required()
        .messages({
          'any.required': 'newMessage is required in body',
        }),
    }
  },

  graphQL() {
    return {
      args: joi
        .object<DTO.ILikeMessage>()
        .keys({ ...this.query, ...this.params, ...this.body })
        .required()
        .messages({
          'any.required': 'messageId, chatId  and newMessage args are required',
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
        'any.required': 'chatId query param is required',
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
