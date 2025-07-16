import joi from 'joi'

import { ICreateStory, IDeleteStory, IGetSingleStory } from '../dto/story.dto'

import { generalFields } from '../../../common/validation/general-fields'

export const getSingleValidator = {
  schema: joi
    .object<IGetSingleStory>()
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
    .object<ICreateStory>()
    .keys({
      content: generalFields.content.max(500),
    })
    .required()
    .messages({
      'any.required': 'createPost body is required',
    }),

  file: joi
    .object<Express.Multer.File>()
    .keys(generalFields.file)
    .required()
    .messages({
      'any.required': 'createPost body is required',
    }),
}

export const deleteValidator = {
  schema: joi
    .object<IDeleteStory>()
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
