import joi from 'joi'
import { IConfirmDeleteDTO, IDeleteAccountDTO } from '../dto/profile.dto'
import { generalFields } from '../../../../common/validation/general-fields'

export const deleteAccountSchema = {
  args: joi
    .object<IDeleteAccountDTO>()
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
    .object<IConfirmDeleteDTO>()
    .keys({
      email: generalFields.email.required(),
      otpCode: generalFields.otpCode.required(),
    })
    .required()
    .messages({
      'any.required': 'confirmDelete body is required',
    }),
}
