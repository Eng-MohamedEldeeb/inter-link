import joi from 'joi'
import {
  IConfirmEmailDTO,
  IForgotPasswordDTO,
  ILoginDTO,
  IResetPasswordDTO,
  IRegisterDTO,
} from '../dto/auth.dto'
import { generalFields } from '../../../common/validation/general-fields'

export const confirmEmailSchema = {
  body: joi
    .object<IConfirmEmailDTO>()
    .keys({
      email: generalFields.email.required(),
    })
    .required()
    .messages({
      'any.required': 'confirmEmail body is required',
    }),
}

export const registerSchema = {
  body: joi
    .object<IRegisterDTO>()
    .keys({
      fullName: generalFields.fullName.required(),
      username: generalFields.username.required(),
      email: generalFields.email.required(),
      password: generalFields.password.required(),
      confirmPassword: generalFields.password
        .valid(joi.ref('password'))
        .required(),
      phone: generalFields.phone.required(),
      birthDate: generalFields.birthDate.required(),
      bio: generalFields.bio,
      otpCode: generalFields.otpCode.required(),
    })
    .required()
    .messages({
      'any.required': 'sign-up body is required',
    }),
}

export const loginSchema = {
  body: joi
    .object<ILoginDTO>()
    .keys({
      username: generalFields.username.required(),
      password: generalFields.password.required(),
    })
    .required()
    .messages({
      'any.required': 'login body is required',
    }),
}

export const forgotPasswordSchema = {
  body: joi
    .object<IForgotPasswordDTO>()
    .keys({
      email: generalFields.email.required(),
    })
    .required()
    .messages({
      'any.required': 'forgotPassword body is required',
    }),
}

export const resetPasswordSchema = {
  body: joi
    .object<IResetPasswordDTO>()
    .keys({
      email: generalFields.email.required(),
      newPassword: generalFields.password.required(),
      confirmPassword: generalFields.password
        .valid(joi.ref('newPassword'))
        .required(),
      otpCode: generalFields.otpCode.required(),
    })
    .required()
    .messages({
      'any.required': 'resetPassword body is required',
    }),
}
