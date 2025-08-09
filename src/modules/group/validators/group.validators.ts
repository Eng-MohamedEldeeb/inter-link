import joi from 'joi'

import * as DTO from '../dto/chat-group.dto'

import { generalFields } from '../../../common/validation/general-fields'
import { isValidMongoId } from '../../../common/validation/is-valid'

export const getSingleChatValidator = {
  schema: joi
    .object<DTO.IGetSingle>()
    .keys({
      groupId: generalFields.mongoId.required(),
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

export const createGroupValidator = {
  schema: joi
    .object<DTO.ICreateGroup>()
    .keys({
      groupName: joi.string().required(),
      description: joi.string().required(),
      members: joi.array().items(generalFields.mongoId).required(),
    })
    .required(),

  http() {
    return {
      body: this.schema.required().messages({
        'any.required':
          '[groupName, description(optional), members]  param is required',
      }),
    }
  },

  graphQL() {
    return {
      args: this.schema.required().messages({
        'any.required':
          '[groupName, description(optional), members] arg is required',
      }),
    }
  },
}

export const addMemberValidator = {
  schema: {
    memberId: generalFields.mongoId,
    groupId: generalFields.mongoId,
  },

  http() {
    return {
      body: joi
        .object<DTO.IAddMember>()
        .keys({ memberId: this.schema.memberId })
        .required()
        .messages({
          'any.required': 'memberId is required',
        }),
      params: joi
        .object<DTO.IAddMember>()
        .keys({ groupId: this.schema.groupId })
        .required()
        .messages({
          'any.required': 'group id array is required',
        }),
    }
  },

  graphQL() {
    return {
      args: joi.object<DTO.IAddMember>().keys(this.schema).required().messages({
        'any.required': 'members array arg is required',
      }),
    }
  },
}

export const removeMemberValidator = {
  schema: {
    memberId: generalFields.mongoId,
    groupId: generalFields.mongoId,
  },

  http() {
    return {
      body: joi
        .object<DTO.IAddMember>()
        .keys({ memberId: this.schema.memberId })
        .required()
        .messages({
          'any.required': 'memberId is required',
        }),
      params: joi
        .object<DTO.IAddMember>()
        .keys({ groupId: this.schema.groupId })
        .required()
        .messages({
          'any.required': 'group id array is required',
        }),
    }
  },

  graphQL() {
    return {
      args: joi.object<DTO.IAddMember>().keys(this.schema).required().messages({
        'any.required': 'members array arg is required',
      }),
    }
  },
}

export const likeMessageValidator = {
  params: {
    groupId: generalFields.mongoId.required(),
  },

  query: {
    messageId: generalFields.mongoId.required(),
  },

  http() {
    return {
      params: joi
        .object<Pick<DTO.ILikeMessage, 'groupId'>>()
        .keys(this.params)
        .required()
        .messages({
          'any.required': 'groupId param is required',
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
          'any.required': 'messageId and groupId args are required',
        }),
    }
  },
}

export const editMessageValidator = {
  params: {
    groupId: generalFields.mongoId.required(),
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
        .object<Pick<DTO.IEditMessage, 'groupId'>>()
        .keys(this.params)
        .required()
        .messages({
          'any.required': 'groupId param and messageId query param is required',
        }),

      query: joi
        .object<Pick<DTO.IEditMessage, 'messageId'>>()
        .keys(this.query)
        .required()
        .messages({
          'any.required': 'groupId and messageId is required',
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
          'any.required':
            'messageId, groupId  and newMessage args are required',
        }),
    }
  },
}

export const deleteMessageValidator = {
  params: {
    groupId: generalFields.mongoId.required(),
  },

  query: {
    messageId: generalFields.mongoId.required(),
  },

  http() {
    return {
      params: joi
        .object<Pick<DTO.ILikeMessage, 'groupId'>>()
        .keys(this.params)
        .required()
        .messages({
          'any.required': 'groupId param and messageId query param is required',
        }),

      query: joi
        .object<Pick<DTO.ILikeMessage, 'messageId'>>()
        .keys(this.query)
        .required()
        .messages({
          'any.required': 'groupId and messageId is required',
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
          'any.required': 'messageId and groupId args are required',
        }),
    }
  },
}
export const leaveChatValidator = {
  schema: joi
    .object<DTO.ILeaveChat>()
    .keys({
      groupId: generalFields.mongoId.required(),
      profileId: generalFields.mongoId.required(),
    })
    .required(),

  http() {
    return {
      query: this.schema.required().messages({
        'any.required': 'groupId query param is required',
      }),
    }
  },

  graphQL() {
    return {
      args: this.schema.required().messages({
        'any.required': 'groupId arg is required',
      }),
    }
  },
}

export const deleteChatValidator = {
  schema: joi
    .object<DTO.IDeleteChat>()
    .keys({
      groupId: generalFields.mongoId.required(),
    })
    .required(),

  http() {
    return {
      query: this.schema.required().messages({
        'any.required': 'groupId query param is required',
      }),
    }
  },

  graphQL() {
    return {
      args: this.schema.required().messages({
        'any.required': 'groupId arg is required',
      }),
    }
  },
}
