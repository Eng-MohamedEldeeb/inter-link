import joi from 'joi'

import * as DTO from '../dto/profile.dto'

import { generalFields } from '../../../common/validation/general-fields'
import { getAllValidator } from '../../post/validators/post.validators'

export const getAllSavedPostsValidator = getAllValidator

export const updateProfileSchema = {
  schema: joi
    .object<DTO.IUpdateProfile>()
    .keys({
      fullName: generalFields.fullName,
      username: generalFields.username,
      birthDate: generalFields.birthDate,
      phone: generalFields.phone,
      bio: generalFields.bio,
    })
    .required(),
  http() {
    return {
      body: this.schema.required().messages({
        'any.required': 'updateProfile body is required',
      }),
    }
  },
  graphQL() {
    return {
      args: this.schema.required().messages({
        'any.required': 'updateProfile args is required',
      }),
    }
  },
}

export const updateProfilePicSchema = {
  schema: joi.object().keys(generalFields.file).required().messages({
    'any.required': 'avatar file is required',
  }),
  http() {
    return { file: this.schema }
  },
}

export const changeEmailSchema = {
  schema: joi
    .object<DTO.IChangeEmail>()
    .keys({
      originalEmail: generalFields.email.required(),
      newEmail: generalFields.email.required(),
      password: generalFields.password.required(),
    })
    .required(),
  http() {
    return {
      body: this.schema.required().messages({
        'any.required': 'changeEmail body is required',
      }),
    }
  },
  graphQL() {
    return {
      args: this.schema.required().messages({
        'any.required': 'changeEmail args is required',
      }),
    }
  },
}

export const confirmNewEmailSchema = {
  schema: joi
    .object<DTO.IConfirmNewEmail>()
    .keys({
      originalEmail: generalFields.email.required(),
      otpCode: generalFields.otpCode.required(),
    })
    .required(),
  http() {
    return {
      body: this.schema.required().messages({
        'any.required': 'confirmNewEmail body is required',
      }),
    }
  },
  graphQL() {
    return {
      args: this.schema.required().messages({
        'any.required': 'confirmNewEmail args is required',
      }),
    }
  },
}

export const deleteAccountSchema = {
  schema: joi
    .object<DTO.IDeleteAccount>()
    .keys({
      email: generalFields.email.required().messages({
        'any.required': 'email is required',
      }),
      password: generalFields.password.required().messages({
        'any.required': 'password is required',
      }),
    })
    .required(),
  http() {
    return {
      body: this.schema.required().messages({
        'any.required': 'deleteAccount body is required',
      }),
    }
  },
  graphQL() {
    return {
      args: this.schema.required().messages({
        'any.required': 'deleteAccount args is required',
      }),
    }
  },
}

export const confirmDeletionSchema = {
  schema: joi
    .object<DTO.IConfirmDelete>()
    .keys({
      email: generalFields.email.required().messages({
        'any.required': 'email is required',
      }),
      otpCode: generalFields.otpCode.required().messages({
        'any.required': 'otpCode is required',
      }),
    })
    .required(),
  http() {
    return {
      body: this.schema.required().messages({
        'any.required': 'confirmDeletion body is required',
      }),
    }
  },
  graphQL() {
    return {
      args: this.schema.required().messages({
        'any.required': 'confirmDeletion args is required',
      }),
    }
  },
}
