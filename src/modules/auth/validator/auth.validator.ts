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
  schema: joi
    .object<IConfirmEmailDTO>()
    .keys({
      email: generalFields.email.required(),
    })
    .required(),
  http() {
    return {
      body: this.schema.messages({
        'any.required': 'confirmEmail body is required',
      }),
    }
  },

  graphQL() {
    return {
      args: this.schema.messages({
        'any.required': 'confirmEmail args is required',
      }),
    }
  },
}

export const registerSchema = {
  schema: joi
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
    .required(),
  http() {
    return {
      body: this.schema.messages({
        'any.required': 'sign-up body is required',
      }),
    }
  },
  graphQL() {
    return {
      args: this.schema.messages({
        'any.required': 'sign-up args is required',
      }),
    }
  },
}

export const loginSchema = {
  schema: joi
    .object<ILoginDTO>()
    .keys({
      username: generalFields.username.required(),
      password: generalFields.password.required(),
    })
    .required(),
  http() {
    return {
      body: this.schema.messages({
        'any.required': 'login args is required',
      }),
    }
  },
  graphQL() {
    return {
      args: this.schema.messages({
        'any.required': 'login body is required',
      }),
    }
  },
}

export const forgotPasswordSchema = {
  schema: joi
    .object<IForgotPasswordDTO>()
    .keys({
      email: generalFields.email.required(),
    })
    .required(),
  http() {
    return {
      body: this.schema.messages({
        'any.required': 'forgotPassword body is required',
      }),
    }
  },
  graphQL() {
    return {
      args: this.schema.messages({
        'any.required': 'forgotPassword args is required',
      }),
    }
  },
}

export const resetPasswordSchema = {
  schema: joi
    .object<IResetPasswordDTO>()
    .keys({
      email: generalFields.email.required(),
      newPassword: generalFields.password.required(),
      confirmPassword: generalFields.password
        .valid(joi.ref('newPassword'))
        .required(),
      otpCode: generalFields.otpCode.required(),
    })
    .required(),

  http() {
    return {
      body: this.schema.messages({
        'any.required': 'resetPassword body is required',
      }),
    }
  },

  graphQL() {
    return {
      args: this.schema.messages({
        'any.required': 'resetPassword args is required',
      }),
    }
  },
}
