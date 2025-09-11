import joi from "joi"

import {
  ICreateStory,
  IDeleteStory,
  IGetAllStory,
  IGetSingleStory,
  ILikeStory,
} from "../modules/story/dto/story.dto"
import { Validator } from "../common/utils/validator/validator"

export class StoryValidator extends Validator {
  public static readonly getAllValidator = {
    schema: joi
      .object<IGetAllStory>()
      .keys({
        userId: this.generalFields.mongoId.required(),
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

  public static readonly getSingleValidator = {
    schema: joi
      .object<IGetSingleStory>()
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

  public static readonly createValidator = {
    body: joi
      .object<ICreateStory>()
      .keys({
        content: this.generalFields.content.max(500),
      })
      .required(),
    file: this.generalFields.file.required(),
  }

  public static readonly deleteValidator = {
    schema: joi
      .object<IDeleteStory>()
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

  public static readonly likeValidator = {
    schema: joi
      .object<ILikeStory>()
      .keys({
        id: this.generalFields.mongoId.required(),
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
