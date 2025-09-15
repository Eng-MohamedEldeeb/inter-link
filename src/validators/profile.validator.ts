import joi from "joi"

import * as DTO from "../modules/apis/profile/dto/profile.dto"

import { PostValidator } from "./post.validator"
import { Validator } from "../common/utils/validator/validator"

export class ProfileValidator extends Validator {
  public static readonly getAllSavedPostsValidator =
    PostValidator.getAllValidator

  public static readonly updateProfileSchema = {
    schema: joi
      .object<DTO.IUpdateProfile>()
      .keys({
        username: this.generalFields.username,
        birthDate: this.generalFields.birthDate,
        phone: this.generalFields.phone,
        bio: this.generalFields.bio,
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

  public static readonly updateProfilePicSchema = {
    schema: this.generalFields.file.required(),
    http() {
      return { file: this.schema }
    },
  }

  public static readonly changeEmailSchema = {
    schema: joi
      .object<DTO.IChangeEmail>()
      .keys({
        originalEmail: this.generalFields.email.required(),
        newEmail: this.generalFields.email.required(),
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

  public static readonly confirmNewEmailSchema = {
    schema: joi
      .object<DTO.IConfirmNewEmail>()
      .keys({
        originalEmail: this.generalFields.email.required(),
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

  public static readonly deleteAccountSchema = {
    schema: joi
      .object<DTO.IDeleteAccount>()
      .keys({
        email: this.generalFields.email.required(),
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

  public static readonly confirmDeletionSchema = {
    schema: joi
      .object<DTO.IConfirmDelete>()
      .keys({
        email: this.generalFields.email.required(),
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
