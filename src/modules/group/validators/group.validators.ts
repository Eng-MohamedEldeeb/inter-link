import joi from 'joi'

import * as GroupDTO from '../dto/group.dto'

import { ICreatePost, IGetSinglePost } from '../../post/dto/post.dto'

import { generalFields } from '../../../common/validation/general-fields'

export const getGroupValidator = {
  schema: joi
    .object<GroupDTO.IGetGroup>()
    .keys({
      groupId: generalFields.mongoId.required(),
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
    .object<GroupDTO.ICreateGroup>()
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

export const addAdminValidator = {
  schema: {
    query: {
      userId: generalFields.mongoId.required(),
    },
    params: {
      groupId: generalFields.mongoId.required(),
    },
  },
  http() {
    return {
      query: joi
        .object<GroupDTO.IAddAdmin>()
        .keys(this.schema.query)
        .required()
        .messages({
          'any.required': 'expected "userId" but got none',
        }),

      params: joi
        .object<GroupDTO.IGetGroup>()
        .keys(this.schema.params)
        .required()
        .messages({
          'any.required': 'expected "id" param but got none',
        }),
    }
  },

  graphQL() {
    return {
      args: joi
        .object<GroupDTO.IAddAdmin>()
        .keys({ ...this.schema.params, ...this.schema.query })
        .required()
        .messages({
          'any.required': 'expected group "id" and "userId" args but got none',
        }),
    }
  },
}

export const removeAdminValidator = {
  schema: {
    params: {
      groupId: generalFields.mongoId.required(),
    },
    query: {
      adminId: generalFields.mongoId.required(),
    },
  },
  http() {
    return {
      query: joi
        .object<GroupDTO.IRemoveAdmin>()
        .keys(this.schema.query)
        .required()
        .messages({
          'any.required': 'expected admin "Id" but got none',
        }),

      params: joi
        .object<GroupDTO.IGetGroup>()
        .keys(this.schema.params)
        .required()
        .messages({
          'any.required': 'expected "id" param but got none',
        }),
    }
  },

  graphQL() {
    return {
      args: joi
        .object<GroupDTO.IRemoveAdmin>()
        .keys({ ...this.schema.params, ...this.schema.query })
        .required()
        .messages({
          'any.required':
            'expected group "id" and admin "Id" args but got none',
        }),
    }
  },
}

export const removePostValidator = {
  schema: {
    params: {
      groupId: generalFields.mongoId.required(),
    },
    query: {
      id: generalFields.mongoId.required(),
    },
  },
  http() {
    return {
      query: joi
        .object<IGetSinglePost>()
        .keys(this.schema.query)
        .required()
        .messages({
          'any.required': 'expected post "Id" query param but got none',
        }),

      params: joi
        .object<GroupDTO.IGetGroup>()
        .keys(this.schema.params)
        .required()
        .messages({
          'any.required': 'expected group "id" param but got none',
        }),
    }
  },

  graphQL() {
    return {
      args: joi
        .object<GroupDTO.IGetGroup>()
        .keys({ ...this.schema.params, ...this.schema.query })
        .required()
        .messages({
          'any.required':
            'expected group "id" and admin "Id" args but got none',
        }),
    }
  },
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
  params: joi
    .object<GroupDTO.IGetGroup>()
    .keys({
      groupId: generalFields.mongoId.required(),
    })
    .required()
    .messages({
      'any.required': 'group "Id" param is required',
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
      groupId: generalFields.mongoId.required(),
    },
  },

  http() {
    return {
      body: joi
        .object<GroupDTO.IEditGroup>()
        .keys(this.schema.body)
        .required()
        .messages({
          'any.required': 'editGroup body is required',
        }),

      query: joi
        .object<GroupDTO.IGetGroup>()
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
        .object<GroupDTO.IEditGroup>()
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
    .object<GroupDTO.IEditGroup>()
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
    .object<GroupDTO.IGetGroup>()
    .keys({
      groupId: generalFields.mongoId.required(),
    })
    .required()
    .messages({
      'any.required': 'groupId id query param is required',
    }),
}

export const changeVisibilityValidator = {
  schema: {
    query: {
      groupId: generalFields.mongoId.required(),
    },
  },

  http() {
    return {
      query: joi
        .object<GroupDTO.IChangeGroupVisibility>()
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
        .object<GroupDTO.IChangeGroupVisibility>()
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
    .object<GroupDTO.IDeleteGroup>()
    .keys({
      groupId: generalFields.mongoId.required(),
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
