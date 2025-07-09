import joi from 'joi'
import { generalFields } from '../../../common/validation/general-fields'
import {
  IBlockUserDTO,
  IGetUserProfileDTO,
  IUnBlockUserDTO,
} from '../dto/user.dto'

export const getUserProfileSchema = {
  schema: joi
    .object<IGetUserProfileDTO>()
    .keys({
      id: generalFields.mongoId,
      user: joi.string().min(3),
    })
    .required(),

  http() {
    return {
      query: this.schema.messages({
        'any.required': 'getUserProfile query is required',
      }),
    }
  },

  graphQL() {
    return {
      args: this.schema.messages({
        'any.required': 'getUserProfile args is required',
      }),
    }
  },
}

export const blockUserSchema = {
  schema: joi
    .object<IBlockUserDTO>()
    .keys({
      id: generalFields.mongoId.required(),
    })
    .required()
    .messages({
      'any.required': 'blockUser body is required',
    }),

  http() {
    return {
      params: this.schema.messages({
        'any.required': 'blockUser params is required',
      }),
    }
  },

  graphQL() {
    return {
      args: this.schema.messages({
        'any.required': 'blockUser args is required',
      }),
    }
  },
}

export const unblockUserSchema = {
  schema: joi
    .object<IUnBlockUserDTO>()
    .keys({
      id: generalFields.mongoId.required(),
    })
    .required(),

  http() {
    return {
      params: this.schema.messages({
        'any.required': 'unblockUser params is required',
      }),
    }
  },

  graphQL() {
    return {
      args: this.schema.messages({
        'any.required': 'unblockUser args is required',
      }),
    }
  },
}
