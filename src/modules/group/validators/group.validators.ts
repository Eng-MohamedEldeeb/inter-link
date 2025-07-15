import joi from 'joi'
import {
  IChangeGroupVisibility,
  ICreateGroup,
  IDeleteGroup,
  IEditGroup,
  IGetGroup,
} from '../dto/group.dto'
import { generalFields } from '../../../common/validation/general-fields'
import { ICreatePost } from '../../post/dto/post.dto'

export const getGroupValidator = {
  schema: joi
    .object<IGetGroup>()
    .keys({
      id: generalFields.mongoId.required(),
    })
    .required(),

  http() {
    return {
      params: this.schema.required().messages({
        'any.required': 'getGroup id param is required',
      }),
    }
  },

  graphQL() {
    return {
      args: this.schema.required().messages({
        'any.required': 'getGroup id arg is required',
      }),
    }
  },
}

export const createValidator = {
  body: joi
    .object<ICreateGroup>()
    .keys({
      name: generalFields.content.min(1).max(28).required(),
      description: generalFields.content.max(500),
      isPrivateGroup: joi.bool(),
    })
    .required()
    .messages({
      'any.required': 'createGroup body is required',
    }),
}

export const addPostValidator = {
  body: joi
    .object<ICreatePost>()
    .keys({
      title: generalFields.content.min(1).max(28).required(),
      content: generalFields.content.max(500),
    })
    .required()
    .messages({
      'any.required': 'addPost body is required',
    }),
  query: joi
    .object<IGetGroup>()
    .keys({
      id: generalFields.mongoId.required(),
    })
    .required()
    .messages({
      'any.required': 'groupId query param is required',
    }),
}

export const editValidator = {
  schema: {
    body: {
      name: generalFields.content.min(1).max(28),
      description: generalFields.content.max(500),
      isPrivateGroup: joi.bool(),
    },

    query: {
      id: generalFields.mongoId.required(),
    },
  },

  http() {
    return {
      body: joi
        .object<IEditGroup>()
        .keys(this.schema.body)
        .required()
        .messages({
          'any.required': 'editGroup body is required',
        }),

      query: joi
        .object<IGetGroup>()
        .keys(this.schema.query)
        .required()
        .messages({
          'any.required': 'editGroup id query param is required',
        }),
    }
  },

  graphQL() {
    return {
      args: joi
        .object<IEditGroup>()
        .keys({ ...this.schema.query, ...this.schema.body })
        .required()
        .messages({
          'any.required': 'editGroup body is required',
        }),
    }
  },
}

export const changeCoverValidator = {
  body: joi
    .object<IEditGroup>()
    .keys({
      name: generalFields.content.min(1).max(28),
      description: generalFields.content.max(500),
      isPrivateGroup: joi.bool(),
    })
    .required()
    .messages({
      'any.required': 'groupId body is required',
    }),

  query: joi
    .object<IGetGroup>()
    .keys({
      id: generalFields.mongoId.required(),
    })
    .required()
    .messages({
      'any.required': 'groupId id query param is required',
    }),
}

export const changeVisibilityValidator = {
  schema: {
    query: {
      id: generalFields.mongoId.required(),
    },
  },

  http() {
    return {
      query: joi
        .object<IChangeGroupVisibility>()
        .keys(this.schema.query)
        .required()
        .messages({
          'any.required': 'editGroup id query param is required',
        }),
    }
  },

  graphQL() {
    return {
      args: joi
        .object<IChangeGroupVisibility>()
        .keys(this.schema.query)
        .required()
        .messages({
          'any.required': 'editGroup body is required',
        }),
    }
  },
}

export const deleteGroupValidator = {
  schema: joi
    .object<IDeleteGroup>()
    .keys({
      id: generalFields.mongoId.required(),
    })
    .required(),
  http() {
    return {
      params: this.schema.required().messages({
        'any.required': 'deleteGroup id  param is required',
      }),
    }
  },

  graphQL() {
    return {
      args: this.schema.required().messages({
        'any.required': 'deleteGroup id arg is required',
      }),
    }
  },
}
