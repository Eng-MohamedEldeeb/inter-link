import joi from 'joi'

import { generalFields } from '../../../common/validation/general-fields'

import * as DTO from '../dto/user.dto'

export const getUserProfileSchema = {
  schema: joi
    .object<DTO.IGetUserProfile>()
    .keys({
      id: generalFields.mongoId,
      username: joi.string().min(3).when(joi.ref('id'), {
        is: joi.exist(),
        then: joi.optional(),
        otherwise: joi.required(),
      }),
    })
    .required(),

  http() {
    return {
      query: this.schema.required().messages({
        'any.required': 'one of [ id , username ] query params is required',
        '"object.unknown"': 'only  [ id , username ]  query params are allowed',
      }),
    }
  },

  graphQL() {
    return {
      args: this.schema.required().messages({
        'any.required': 'one of [ id , username ] args is required',
        '"object.unknown"': 'only  [ id , username ]  args are allowed',
      }),
    }
  },
}

export const blockUserSchema = {
  schema: joi.object<DTO.IBlockUser>().keys({
    id: generalFields.mongoId.required(),
  }),
  http() {
    return {
      query: this.schema.required().messages({
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
  schema: joi.object<DTO.IUnBlockUser>().keys({
    id: generalFields.mongoId.required(),
  }),
  http() {
    return {
      query: this.schema.required().messages({
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

export const followUserSchema = {
  schema: joi.object<DTO.IFollowUser>().keys({
    id: generalFields.mongoId.required(),
  }),
  http() {
    return {
      query: this.schema.required().messages({
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

export const unfollowUserSchema = {
  schema: joi.object<DTO.IUnFollowUser>().keys({
    id: generalFields.mongoId.required(),
  }),
  http() {
    return {
      query: this.schema.required().messages({
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

export const acceptFollowRequestSchema = {
  schema: joi.object<DTO.IAcceptFollowRequest>().keys({
    id: generalFields.mongoId.required(),
  }),
  http() {
    return {
      query: this.schema.required().messages({
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

export const rejectFollowRequestSchema = {
  schema: joi.object<DTO.IRejectFollowRequest>().keys({
    id: generalFields.mongoId.required(),
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
