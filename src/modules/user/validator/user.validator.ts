import joi from 'joi'

import { generalFields } from '../../../common/validation/general-fields'

import * as DTO from '../dto/user.dto'

export const getUserProfileSchema = {
  schema: joi
    .object<DTO.IGetUserProfile>()
    .keys({
      id: generalFields.mongoId,
      user: joi.string().min(3).when(joi.ref('id'), {
        is: joi.exist(),
        then: joi.optional(),
        otherwise: joi.required(),
      }),
    })
    .required(),

  http() {
    return {
      query: this.schema.required().messages({
        'any.required': 'one of [ id , user ] query params is required',
        '"object.unknown"': 'only  [ id , user ]  query params are allowed',
      }),
    }
  },

  graphQL() {
    return {
      args: this.schema.required().messages({
        'any.required': 'one of [ id , user ] args is required',
        '"object.unknown"': 'only  [ id , user ]  args are allowed',
      }),
    }
  },
}

export const blockUserSchema = {
  schema: joi
    .object<DTO.IBlockUser>()
    .keys({
      id: generalFields.mongoId.required(),
    })
    .required()
    .messages({
      'any.required': 'blockUser body is required',
    }),

  http() {
    return {
      params: this.schema.required().messages({
        'any.required': '[id] param is required',
      }),
    }
  },

  graphQL() {
    return {
      args: this.schema.required().messages({
        'any.required': '[id] arg is required',
      }),
    }
  },
}

export const unblockUserSchema = {
  schema: joi
    .object<DTO.IUnBlockUser>()
    .keys({
      id: generalFields.mongoId.required(),
    })
    .required(),

  http() {
    return {
      params: this.schema.required().messages({
        'any.required': '[id] param is required',
      }),
    }
  },

  graphQL() {
    return {
      args: this.schema.required().messages({
        'any.required': '[id] arg is required',
      }),
    }
  },
}
