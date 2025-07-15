import joi from 'joi'
import {
  ICreatePost,
  IEditPost,
  IGetAll,
  IGetSinglePost,
} from '../dto/post.dto'
import { isValidNumericString } from '../../../common/validation/is-valid'
import { generalFields } from '../../../common/validation/general-fields'

export const getAllValidator = {
  schema: joi.object<IGetAll>().keys({
    page: joi.string().custom(isValidNumericString('page')).messages({
      'string.base': 'enter a valid page number',
    }),
    limit: joi.string().custom(isValidNumericString('limit')).messages({
      'string.base': 'enter a valid limit number',
    }),
  }),

  http() {
    return {
      query: this.schema,
    }
  },

  graphQL() {
    return {
      args: this.schema,
    }
  },
}

export const getSingleValidator = {
  schema: joi
    .object<IGetSinglePost>()
    .keys({
      id: generalFields.mongoId.required(),
    })
    .required(),

  http() {
    return {
      params: this.schema.required().messages({
        'any.required': 'editPost id param is required',
      }),
    }
  },

  graphQL() {
    return {
      args: this.schema.required().messages({
        'any.required': 'editPost id arg is required',
      }),
    }
  },
}

export const createValidator = {
  body: joi
    .object<ICreatePost>()
    .keys({
      title: generalFields.content.min(1).max(50).required(),
      content: generalFields.content.max(500),
      onGroup: generalFields.mongoId,
    })
    .required()
    .messages({
      'any.required': 'createPost body is required',
    }),
}

export const editValidator = {
  schema: {
    body: {
      title: generalFields.content.min(1).when(joi.ref('content'), {
        is: joi.exist(),
        then: joi.optional(),
        otherwise: joi.required(),
      }),
      content: generalFields.content.max(500),
    },

    query: {
      id: generalFields.mongoId.required(),
    },
  },

  http() {
    return {
      body: joi.object<IEditPost>().keys(this.schema.body).required().messages({
        'any.required': 'editPost body is required',
      }),

      query: joi
        .object<IGetSinglePost>()
        .keys(this.schema.query)
        .required()
        .messages({
          'any.required': 'editPost id query param is required',
        }),
    }
  },

  graphQL() {
    return {
      args: joi
        .object<IEditPost>()
        .keys({ ...this.schema.query, ...this.schema.body })
        .required()
        .messages({
          'any.required': 'editPost body is required',
        }),
    }
  },
}

export const saveValidator = {
  schema: joi
    .object<IGetSinglePost>()
    .keys({
      id: generalFields.mongoId.required(),
    })
    .required(),

  http() {
    return {
      query: this.schema.required().messages({
        'any.required': '[id] query param is required',
        '"object.unknown"': 'only [id] query param is allowed',
      }),
    }
  },

  graphQL() {
    return {
      args: this.schema.required().messages({
        'any.required': 'savePost id arg is required',
      }),
    }
  },
}

export const sharedValidator = {
  schema: joi
    .object<IGetSinglePost>()
    .keys({
      id: generalFields.mongoId.required(),
    })
    .required(),

  http() {
    return {
      query: this.schema.required().messages({
        'any.required': '[id] query param is required',
        '"object.unknown"': 'only [id] query param is allowed',
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

export const archiveValidator = {
  schema: joi
    .object<IGetSinglePost>()
    .keys({
      id: generalFields.mongoId.required(),
    })
    .required(),

  http() {
    return {
      query: this.schema.required().messages({
        'any.required': 'archivePost id query param is required',
        '"object.unknown"': 'only [id] query param are allowed',
      }),
    }
  },

  graphQL() {
    return {
      args: this.schema.required().messages({
        'any.required': 'archivePost id arg is required',
      }),
    }
  },
}

export const restoreValidator = {
  schema: joi
    .object<IGetSinglePost>()
    .keys({
      id: generalFields.mongoId.required(),
    })
    .required(),

  http() {
    return {
      query: this.schema.required().messages({
        'any.required': 'restorePost id query param is required',
        '"object.unknown"': 'only [id] query param are allowed',
      }),
    }
  },

  graphQL() {
    return {
      args: this.schema.required().messages({
        'any.required': 'restorePost id arg is required',
      }),
    }
  },
}

export const deleteValidator = {
  schema: joi
    .object<IGetSinglePost>()
    .keys({
      id: generalFields.mongoId.required(),
    })
    .required(),
  http() {
    return {
      params: this.schema.required().messages({
        'any.required': 'deletePost id param is required',
      }),
    }
  },

  graphQL() {
    return {
      args: this.schema.required().messages({
        'any.required': 'deletePost id arg is required',
      }),
    }
  },
}
