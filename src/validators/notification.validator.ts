import joi from "joi"

import * as DTO from "../modules/apis/notification/dto/notification.dto"
import { Validator } from "../common/utils/validator/validator"

export class NotificationValidator extends Validator {
  public static readonly getUserNotificationsValidator = {
    schema: joi
      .object<DTO.IGetNotification>()
      .keys({
        id: this.generalFields.mongoId.required(),
      })
      .required(),

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

  public static readonly deleteNotificationValidator = {
    schema: joi
      .object<DTO.IGetNotification>()
      .keys({
        id: this.generalFields.mongoId.required(),
      })
      .required(),

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
