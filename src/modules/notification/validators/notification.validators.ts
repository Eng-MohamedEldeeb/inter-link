import joi from "joi"

import * as DTO from "../dto/notification.dto"

import { generalFields } from "../../../common/validation/general-fields"

export const getUserNotificationsValidator = {
  schema: joi
    .object<DTO.IGetNotification>()
    .keys({
      id: generalFields.mongoId.required(),
    })
    .required(),

  http() {
    return {
      params: this.schema.required().messages({
        "any.required": "notification id param is required",
      }),
    }
  },

  graphql() {
    return {
      args: this.schema.required().messages({
        "any.required": "notification id arg is required",
      }),
    }
  },
}

export const deleteNotificationValidator = {
  schema: joi
    .object<DTO.IGetNotification>()
    .keys({
      id: generalFields.mongoId.required(),
    })
    .required(),

  http() {
    return {
      params: this.schema.required().messages({
        "any.required": "notification id param is required",
      }),
    }
  },

  graphql() {
    return {
      args: this.schema.required().messages({
        "any.required": "notification id arg is required",
      }),
    }
  },
}
