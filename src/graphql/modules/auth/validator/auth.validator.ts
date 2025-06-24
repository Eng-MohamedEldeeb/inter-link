import joi from 'joi'
import {
  IConfirmEmailDto,
  IForgotPasswordDto,
  ILoginDto,
  IResetPasswordDto,
  IRegisterDto,
} from '../dto/auth.dto'
import { generalFields } from '../../../../common/validation/general-fields'

export const confirmEmailSchema = {
  args: joi
    .object<IConfirmEmailDto>()
    .keys({
      email: generalFields.email.required(),
    })
    .required()
    .messages({
      'any.required': 'confirmEmail args is required',
    }),
}

export const registerSchema = {
  args: joi
    .object<IRegisterDto>()
    .keys({
      fullName: generalFields.fullName.required().messages({
        'any.required': 'fullName arg is required',
      }),
      username: generalFields.username.required().messages({
        'any.required': 'username arg is required',
      }),
      email: generalFields.email.required().messages({
        'any.required': 'email arg is required',
      }),
      password: generalFields.password.required().messages({
        'any.required': 'password arg is required',
      }),
      confirmPassword: generalFields.password
        .valid(joi.ref('password'))
        .required()
        .messages({
          'any.required': 'confirmPassword arg is required',
        }),
      phone: generalFields.phone.required().messages({
        'any.required': 'phone arg is required',
      }),
      birthDate: generalFields.birthDate.required().messages({
        'any.required': 'birthDate arg is required',
      }),
      otpCode: generalFields.otpCode.required().messages({
        'any.required': 'otpCode arg is required',
      }),
    })
    .required()
    .messages({
      'any.required': 'sign-up args is required',
    }),
}

export const loginSchema = {
  args: joi
    .object<ILoginDto>()
    .keys({
      username: generalFields.username.required(),
      password: generalFields.password.required(),
    })
    .required()
    .messages({
      'any.required': 'login args is required',
    }),
}

export const forgotPasswordSchema = {
  args: joi
    .object<IForgotPasswordDto>()
    .keys({
      email: generalFields.email.required(),
    })
    .required()
    .messages({
      'any.required': 'forgotPassword args is required',
    }),
}

export const resetPasswordSchema = {
  args: joi
    .object<IResetPasswordDto>()
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
      'any.required': 'resetPassword args is required',
    }),
}
