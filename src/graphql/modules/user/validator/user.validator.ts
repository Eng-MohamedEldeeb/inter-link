import joi from 'joi'
import { IConfirmDeleteDto, IDeleteAccountDto } from '../dto/user.dto'
import { generalFields } from '../../../../common/validation/general-fields'

export const deleteAccountSchema = {
  args: joi
    .object<IDeleteAccountDto>()
    .keys({
      email: generalFields.email.required(),
      password: generalFields.password.required(),
    })
    .required()
    .messages({
      'any.required': 'deleteAccount args is required',
    }),
}

export const confirmDeleteSchema = {
  args: joi
    .object<IConfirmDeleteDto>()
    .keys({
      email: generalFields.email.required(),
      otpCode: generalFields.otpCode.required(),
    })
    .required()
    .messages({
      'any.required': 'confirmDelete body is required',
    }),
}
