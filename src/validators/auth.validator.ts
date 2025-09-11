import joi from "joi"

import * as DTO from "../modules/auth/dto/auth.dto"

import { Validator } from "../common/utils/validator/validator"

export class AuthValidator extends Validator {
  public static readonly confirmEmailValidator = {
    schema: joi
      .object<DTO.IConfirmEmail>()
      .keys({
        email: this.generalFields.email.required(),
      })
      .required(),
    http() {
      return {
        body: this.schema.required(),
      }
    },

    graphql() {
      return {
        args: this.schema.required(),
      }
    },
  }

  public static readonly registerValidator = {
    schema: joi
      .object<DTO.IRegister>()
      .keys({
        username: this.generalFields.username.required(),
        email: this.generalFields.email.required(),
        password: this.generalFields.password.required(),
        confirmPassword: this.generalFields.password
          .valid(joi.ref("password"))
          .required()
          .messages({
            "any.required": this.validationMessage({
              fieldName: "confirmPassword",
            })["any.required"],
            "any.only": this.validationMessage({ fieldName: "Passwords" })[
              "any.only"
            ],
          }),
        phone: this.generalFields.phone.required(),
        birthDate: this.generalFields.birthDate.required(),
        bio: this.generalFields.bio,
        otpCode: this.generalFields.otpCode.required(),
      })
      .required(),
    http() {
      return {
        body: this.schema.required(),
      }
    },
    graphql() {
      return {
        args: this.schema.required(),
      }
    },
  }

  public static readonly loginValidator = {
    schema: joi
      .object<DTO.ILogin>()
      .keys({
        username: this.generalFields.username.required(),
        password: this.generalFields.password.required(),
      })
      .required(),
    http() {
      return {
        body: this.schema.required(),
      }
    },
    graphql() {
      return {
        args: this.schema.required(),
      }
    },
  }

  public static readonly forgotPasswordValidator = {
    schema: joi
      .object<DTO.IForgotPassword>()
      .keys({
        email: this.generalFields.email.required(),
      })
      .required(),
    http() {
      return {
        body: this.schema.required(),
      }
    },
    graphql() {
      return {
        args: this.schema.required(),
      }
    },
  }

  public static readonly resetPasswordValidator = {
    schema: joi
      .object<DTO.IResetPassword>()
      .keys({
        email: this.generalFields.email.required(),
        newPassword: this.generalFields.password.required(),
        confirmPassword: this.generalFields.password
          .valid(joi.ref("newPassword"))
          .required(),
        otpCode: this.generalFields.otpCode.required(),
      })
      .required(),

    http() {
      return {
        body: this.schema.required(),
      }
    },

    graphql() {
      return {
        args: this.schema.required(),
      }
    },
  }
}
