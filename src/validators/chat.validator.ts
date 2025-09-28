import joi from "joi"

import * as DTO from "../modules/apis/chat/dto/chat.dto"
import { Validator } from "../common/utils/validator/validator"

export class ChatValidator extends Validator {
  public static readonly getSingleChatValidator = {
    schema: joi
      .object<DTO.IGetSingleChat>()
      .keys({
        chatId: this.generalFields.mongoId.required(),
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

  public static readonly sendImageMessageValidator = {
    file: this.generalFields.file.required(),
  }

  public static readonly likeMessageValidator = {
    params: {
      chatId: this.generalFields.mongoId.required(),
    },

    query: {
      messageId: this.generalFields.mongoId.required(),
    },

    http() {
      return {
        params: joi
          .object<Pick<DTO.ILikeMessage, "chatId">>()
          .keys(this.params)
          .required(),
        query: joi
          .object<Pick<DTO.ILikeMessage, "messageId">>()
          .keys(this.query)
          .required(),
      }
    },

    graphql() {
      return {
        args: joi
          .object<DTO.ILikeMessage>()
          .keys({ ...this.query, ...this.params })
          .required(),
      }
    },
  }

  public static readonly editMessageValidator = {
    params: {
      chatId: this.generalFields.mongoId.required(),
      messageId: this.generalFields.mongoId.required(),
    },

    body: {
      newMessage: joi.string().max(700).required(),
    },

    http() {
      return {
        params: joi.object<DTO.IEditMessage>().keys(this.params).required(),
        body: joi
          .object<Pick<DTO.IEditMessage, "newMessage">>()
          .keys(this.body)
          .required(),
      }
    },

    graphql() {
      return {
        args: joi
          .object<DTO.IMessageDetail>()
          .keys({ ...this.params, ...this.body })
          .required(),
      }
    },
  }

  public static readonly deleteMessageValidator = {
    params: {
      chatId: this.generalFields.mongoId.required(),
      messageId: this.generalFields.mongoId.required(),
    },

    http() {
      return {
        params: joi.object<DTO.IMessageDetail>().keys(this.params).required(),
      }
    },

    graphql() {
      return {
        args: joi.object<DTO.ILikeMessage>().keys(this.params).required(),
      }
    },
  }

  public static readonly deleteChatValidator = {
    schema: joi
      .object<DTO.IDeleteChat>()
      .keys({
        chatId: this.generalFields.mongoId.required(),
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
}
