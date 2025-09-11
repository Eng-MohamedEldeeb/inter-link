import joi from "joi"

import * as DTO from "../modules/user/dto/user.dto"
import { Validator } from "../common/utils/validator/validator"

export class UserValidator extends Validator {
  public static readonly getUserProfileSchema = {
    schema: joi
      .object<DTO.IGetUserProfile>()
      .keys({
        user_id: this.generalFields.mongoId,
        username: joi.string().min(3).when(joi.ref("user_id"), {
          is: joi.exist(),
          then: joi.optional(),
          otherwise: joi.required(),
        }),
      })
      .required(),

    http() {
      return {
        query: this.schema.required(),
      }
    },

    graphql() {
      return {
        args: this.schema.required(),
      }
    },
  }

  public static readonly blockUserSchema = {
    schema: joi.object<DTO.IBlockUser>().keys({
      user_id: this.generalFields.mongoId.required(),
    }),
    http() {
      return {
        query: this.schema.required(),
      }
    },

    graphql() {
      return {
        args: this.schema.required(),
      }
    },
  }

  public static readonly unblockUserSchema = {
    schema: joi.object<DTO.IUnBlockUser>().keys({
      user_id: this.generalFields.mongoId.required(),
    }),
    http() {
      return {
        query: this.schema.required(),
      }
    },

    graphql() {
      return {
        args: this.schema.required(),
      }
    },
  }

  public static readonly followUserSchema = {
    schema: joi.object<DTO.IFollowUser>().keys({
      user_id: this.generalFields.mongoId.required(),
    }),
    http() {
      return {
        query: this.schema.required(),
      }
    },

    graphql() {
      return {
        args: this.schema.required(),
      }
    },
  }

  public static readonly unfollowUserSchema = {
    schema: joi.object<DTO.IUnFollowUser>().keys({
      user_id: this.generalFields.mongoId.required(),
    }),
    http() {
      return {
        query: this.schema.required(),
      }
    },

    graphql() {
      return {
        args: this.schema.required(),
      }
    },
  }

  public static readonly acceptFollowRequestSchema = {
    schema: joi.object<DTO.IAcceptFollowRequest>().keys({
      user_id: this.generalFields.mongoId.required(),
    }),
    http() {
      return {
        query: this.schema.required(),
      }
    },

    graphql() {
      return {
        args: this.schema.required(),
      }
    },
  }

  public static readonly rejectFollowRequestSchema = {
    schema: joi.object<DTO.IRejectFollowRequest>().keys({
      user_id: this.generalFields.mongoId.required(),
    }),
    http() {
      return {
        params: this.schema.required(),
      }
    },

    graphql() {
      return {
        args: this.schema.required(),
      }
    },
  }
}
