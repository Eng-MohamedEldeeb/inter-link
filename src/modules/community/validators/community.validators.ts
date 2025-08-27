import joi from 'joi'

import * as CommunityDTO from '../dto/community.dto'

import { ICreatePost, IPostId } from '../../post/dto/post.dto'

import { generalFields } from '../../../common/validation/general-fields'

export const getCommunityValidator = {
  schema: joi
    .object<CommunityDTO.IGetCommunity>()
    .keys({
      communityId: generalFields.mongoId.required(),
    })
    .required(),

  http() {
    return {
      params: this.schema.required().messages({
        'any.required': 'getCommunity id param is required',
      }),
    }
  },

  graphql() {
    return {
      args: this.schema.required().messages({
        'any.required': 'getCommunity id arg is required',
      }),
    }
  },
}

export const createValidator = {
  body: joi
    .object<CommunityDTO.ICreateCommunity>()
    .keys({
      name: generalFields.content.min(1).max(28).required(),
      description: generalFields.content.max(500),
      isPrivateCommunity: joi.bool(),
    })
    .required()
    .messages({
      'any.required': 'createCommunity body is required',
    }),
}

export const joinCommunityValidator = {
  query: { communityId: generalFields.mongoId.required() },

  http() {
    return {
      query: joi
        .object<Pick<CommunityDTO.IJoinCommunity, 'communityId'>>()
        .keys(this.query)
        .required()
        .messages({
          'any.required': '( communityId ) query param is required',
        }),
    }
  },

  graphql() {
    return {
      args: joi
        .object<Pick<CommunityDTO.IJoinCommunity, 'communityId'>>()
        .keys(this.query)
        .required()
        .messages({
          'any.required': '( communityId ) arg is required',
        }),
    }
  },
}

export const acceptJoinRequestValidator = {
  query: {
    communityId: generalFields.mongoId.required(),
    userId: generalFields.mongoId.required(),
  },

  http() {
    return {
      query: joi
        .object<Pick<CommunityDTO.IAcceptJoinRequest, 'communityId'>>()
        .keys(this.query)
        .required()
        .messages({
          'any.required': '( communityId, userId ) query param is required',
        }),
    }
  },

  graphql() {
    return {
      args: joi
        .object<Pick<CommunityDTO.IAcceptJoinRequest, 'communityId'>>()
        .keys(this.query)
        .required()
        .messages({
          'any.required': '( communityId, userId ) arg is required',
        }),
    }
  },
}

export const leaveCommunityValidator = {
  query: { communityId: generalFields.mongoId.required() },

  http() {
    return {
      query: joi
        .object<Pick<CommunityDTO.ILeaveCommunity, 'communityId'>>()
        .keys(this.query)
        .required()
        .messages({
          'any.required': '( communityId ) query param is required',
        }),
    }
  },

  graphql() {
    return {
      args: joi
        .object<Pick<CommunityDTO.IJoinCommunity, 'communityId'>>()
        .keys(this.query)
        .required()
        .messages({
          'any.required': '( communityId ) arg is required',
        }),
    }
  },
}

export const addAdminValidator = {
  schema: {
    query: {
      userId: generalFields.mongoId.required(),
    },
    params: {
      communityId: generalFields.mongoId.required(),
    },
  },
  http() {
    return {
      query: joi
        .object<CommunityDTO.IAddAdmin>()
        .keys(this.schema.query)
        .required()
        .messages({
          'any.required': 'expected "userId" but got none',
        }),

      params: joi
        .object<CommunityDTO.IGetCommunity>()
        .keys(this.schema.params)
        .required()
        .messages({
          'any.required': 'expected "id" param but got none',
        }),
    }
  },

  graphql() {
    return {
      args: joi
        .object<CommunityDTO.IAddAdmin>()
        .keys({ ...this.schema.params, ...this.schema.query })
        .required()
        .messages({
          'any.required':
            'expected community "id" and "userId" args but got none',
        }),
    }
  },
}

export const removeAdminValidator = {
  schema: {
    params: {
      communityId: generalFields.mongoId.required(),
    },
    query: {
      adminId: generalFields.mongoId.required(),
    },
  },
  http() {
    return {
      query: joi
        .object<CommunityDTO.IRemoveAdmin>()
        .keys(this.schema.query)
        .required()
        .messages({
          'any.required': 'expected admin "Id" but got none',
        }),

      params: joi
        .object<CommunityDTO.IGetCommunity>()
        .keys(this.schema.params)
        .required()
        .messages({
          'any.required': 'expected "id" param but got none',
        }),
    }
  },

  graphql() {
    return {
      args: joi
        .object<CommunityDTO.IRemoveAdmin>()
        .keys({ ...this.schema.params, ...this.schema.query })
        .required()
        .messages({
          'any.required':
            'expected community "id" and admin "Id" args but got none',
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
  query: joi
    .object<CommunityDTO.IGetCommunity>()
    .keys({
      communityId: generalFields.mongoId.required(),
    })
    .required()
    .messages({
      'any.required': 'community "Id" query param is required',
    }),
}

export const removePostValidator = {
  schema: {
    params: {
      communityId: generalFields.mongoId.required(),
    },
    query: {
      postId: generalFields.mongoId.required(),
    },
  },
  http() {
    return {
      query: joi.object<IPostId>().keys(this.schema.query).required().messages({
        'any.required': 'expected post "Id" query param but got none',
      }),

      params: joi
        .object<CommunityDTO.IGetCommunity>()
        .keys(this.schema.params)
        .required()
        .messages({
          'any.required': 'expected community "id" param but got none',
        }),
    }
  },

  graphql() {
    return {
      args: joi
        .object<CommunityDTO.IGetCommunity>()
        .keys({ ...this.schema.params, ...this.schema.query })
        .required()
        .messages({
          'any.required':
            'expected community "id" and admin "Id" args but got none',
        }),
    }
  },
}

export const editValidator = {
  schema: {
    body: {
      name: generalFields.content.min(1).max(28),
      description: generalFields.content.max(500),
      isPrivateCommunity: joi.bool(),
    },

    query: {
      communityId: generalFields.mongoId.required(),
    },
  },

  http() {
    return {
      body: joi
        .object<CommunityDTO.IEditCommunity>()
        .keys(this.schema.body)
        .required()
        .messages({
          'any.required': 'editCommunity body is required',
        }),

      query: joi
        .object<CommunityDTO.IGetCommunity>()
        .keys(this.schema.query)
        .required()
        .messages({
          'any.required': 'editCommunity id query param is required',
        }),
    }
  },

  graphql() {
    return {
      args: joi
        .object<CommunityDTO.IEditCommunity>()
        .keys({ ...this.schema.query, ...this.schema.body })
        .required()
        .messages({
          'any.required': 'editCommunity body is required',
        }),
    }
  },
}

export const changeCoverValidator = {
  body: joi
    .object<CommunityDTO.IEditCommunity>()
    .keys({
      name: generalFields.content.min(1).max(28),
      description: generalFields.content.max(500),
    })
    .required()
    .messages({
      'any.required': 'communityId body is required',
    }),

  query: joi
    .object<CommunityDTO.IGetCommunity>()
    .keys({
      communityId: generalFields.mongoId.required(),
    })
    .required()
    .messages({
      'any.required': 'communityId id query param is required',
    }),
}

export const changeVisibilityValidator = {
  schema: {
    query: {
      communityId: generalFields.mongoId.required(),
    },
  },

  http() {
    return {
      query: joi
        .object<CommunityDTO.IChangeCommunityVisibility>()
        .keys(this.schema.query)
        .required()
        .messages({
          'any.required': 'editCommunity id query param is required',
        }),
    }
  },

  graphql() {
    return {
      args: joi
        .object<CommunityDTO.IChangeCommunityVisibility>()
        .keys(this.schema.query)
        .required()
        .messages({
          'any.required': 'editCommunity body is required',
        }),
    }
  },
}

export const deleteCommunityValidator = {
  schema: joi
    .object<CommunityDTO.IDeleteCommunity>()
    .keys({
      communityId: generalFields.mongoId.required(),
    })
    .required(),
  http() {
    return {
      params: this.schema.required().messages({
        'any.required': 'deleteCommunity id  param is required',
      }),
    }
  },

  graphql() {
    return {
      args: this.schema.required().messages({
        'any.required': 'deleteCommunity id arg is required',
      }),
    }
  },
}
