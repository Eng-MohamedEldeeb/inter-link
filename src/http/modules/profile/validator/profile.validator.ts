import joi from 'joi'
import {
  IChangeEmailDTO,
  IConfirmDeleteDTO,
  IConfirmNewEmailDTO,
  IDeleteAccountDTO,
  IUpdateProfileDTO,
} from '../dto/profile.dto'
import { generalFields } from '../../../../common/validation/general-fields'

export const updateProfileSchema = {
  file: joi
    .object<IUpdateProfileDTO>()
    .keys({
      fullName: generalFields.fullName,
      username: generalFields.username,
      birthDate: generalFields.birthDate,
      phone: generalFields.phone,
      bio: generalFields.bio,
    })
    .required()
    .messages({
      'any.required': 'avatar file is required',
    }),
}

export const updateProfilePicSchema = {
  file: joi.object().keys(generalFields.file).required().messages({
    'any.required': 'changeEmail body is required',
  }),
}

export const changeEmailSchema = {
  body: joi
    .object<IChangeEmailDTO>()
    .keys({
      newEmail: generalFields.email.required(),
      password: generalFields.password.required(),
    })
    .required()
    .messages({
      'any.required': 'changeEmail body is required',
    }),
}

export const confirmNewEmailSchema = {
  body: joi
    .object<IConfirmNewEmailDTO>()
    .keys({
      email: generalFields.email.required(),
      otpCode: generalFields.otpCode.required(),
    })
    .required()
    .messages({
      'any.required': 'confirmNewEmail body is required',
    }),
}

export const deleteAccountSchema = {
  body: joi
    .object<IDeleteAccountDTO>()
    .keys({
      email: generalFields.email.required(),
      password: generalFields.password.required(),
    })
    .required()
    .messages({
      'any.required': 'deleteAccount body is required',
    }),
}

export const confirmDeletionSchema = {
  body: joi
    .object<IConfirmDeleteDTO>()
    .keys({
      email: generalFields.email.required(),
      otpCode: generalFields.otpCode.required(),
    })
    .required()
    .messages({
      'any.required': 'confirmDeletion body is required',
    }),
}
