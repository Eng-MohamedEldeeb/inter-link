import joi from 'joi'

import * as DTO from '../dto/chat.dto'

import { generalFields } from '../../../common/validation/general-fields'

export const getSingleChatValidator = {
  schema: joi
    .object<DTO.IGetSingleChat>()
    .keys({
      currentChatId: generalFields.mongoId.required(),
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
    currentChatId: generalFields.mongoId.required(),
  },

  query: {
    messageId: generalFields.mongoId.required(),
  },

  http() {
    return {
      params: joi
        .object<Pick<DTO.ILikeMessage, 'currentChatId'>>()
        .keys(this.params)
        .required()
        .messages({
          'any.required': 'currentChatId param is required',
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
          'any.required': 'messageId and currentChatId args are required',
        }),
    }
  },
}

export const deleteMessageValidator = {
  params: {
    currentChatId: generalFields.mongoId.required(),
  },

  query: {
    messageId: generalFields.mongoId.required(),
  },

  http() {
    return {
      params: joi
        .object<Pick<DTO.ILikeMessage, 'currentChatId'>>()
        .keys(this.params)
        .required()
        .messages({
          'any.required':
            'currentChatId param and messageId query param is required',
        }),

      query: joi
        .object<Pick<DTO.ILikeMessage, 'messageId'>>()
        .keys(this.query)
        .required()
        .messages({
          'any.required': 'currentChatId and messageId is required',
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
          'any.required': 'messageId and currentChatId args are required',
        }),
    }
  },
}
export const deleteChatValidator = {
  schema: joi
    .object<DTO.IDeleteChat>()
    .keys({
      currentChatId: generalFields.mongoId.required(),
    })
    .required(),

  http() {
    return {
      query: this.schema.required().messages({
        'any.required': 'currentChatId  param is required',
      }),
    }
  },

  graphQL() {
    return {
      args: this.schema.required().messages({
        'any.required': 'currentChatId arg is required',
      }),
    }
  },
}
