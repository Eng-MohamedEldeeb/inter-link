import joi from 'joi'
import { generalFields } from '../../../../common/validation/general-fields'
import {
  IBlockUserDTO,
  IGetUserProfileDTO,
  IUnBlockUserDTO,
} from '../dto/user.dto'

export const getUserProfileSchema = {
  query: joi
    .object<IGetUserProfileDTO>()
    .keys({
      id: generalFields.mongoId,
      user: joi.string().min(3),
    })
    .required()
    .messages({
      'any.required': 'getUserProfile query is required',
    }),
}

export const blockUserSchema = {
  params: joi
    .object<IBlockUserDTO>()
    .keys({
      id: generalFields.mongoId.required(),
    })
    .required()
    .messages({
      'any.required': 'blockUser body is required',
    }),
}

export const unblockUserSchema = {
  params: joi
    .object<IUnBlockUserDTO>()
    .keys({
      id: generalFields.mongoId.required(),
    })
    .required()
    .messages({
      'any.required': 'unblockUser body is required',
    }),
}
