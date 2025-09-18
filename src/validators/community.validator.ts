import joi from "joi"

import * as CommunityDTO from "../modules/apis/community/dto/community.dto"

import { ICreatePost, IPostId } from "../modules/apis/post/dto/post.dto"
import { Validator } from "../common/utils/validator/validator"

export class CommunityValidator extends Validator {
  public static readonly getCommunityValidator = {
    schema: joi
      .object<CommunityDTO.IGetCommunity>()
      .keys({
        communityId: this.generalFields.mongoId.required(),
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
    schema: {
      name: this.generalFields.body.min(1).max(28).required(),
      description: this.generalFields.body.max(500),
      isPrivateCommunity: joi.bool(),
    },

    http() {
      return {
        body: joi
          .object<CommunityDTO.ICreateCommunity>()
          .keys({
            name: this.schema.name.required(),
            description: this.schema.description,
            isPrivateCommunity: this.schema.isPrivateCommunity,
          })
          .required(),
      }
    },

    graphql() {
      return {
        args: joi
          .object<Omit<CommunityDTO.ICreateCommunity, "cover">>()
          .keys(this.schema)
          .required(),
      }
    },
  }

  public static readonly joinCommunityValidator = {
    query: { communityId: this.generalFields.mongoId.required() },

    http() {
      return {
        query: joi
          .object<Pick<CommunityDTO.IJoinCommunity, "communityId">>()
          .keys(this.query)
          .required(),
      }
    },

    graphql() {
      return {
        args: joi
          .object<Pick<CommunityDTO.IJoinCommunity, "communityId">>()
          .keys(this.query)
          .required(),
      }
    },
  }

  public static readonly acceptJoinRequestValidator = {
    query: {
      communityId: this.generalFields.mongoId.required(),
      userId: this.generalFields.mongoId.required(),
    },

    http() {
      return {
        query: joi
          .object<Pick<CommunityDTO.IAcceptJoinRequest, "communityId">>()
          .keys(this.query)
          .required(),
      }
    },

    graphql() {
      return {
        args: joi
          .object<Pick<CommunityDTO.IAcceptJoinRequest, "communityId">>()
          .keys(this.query)
          .required(),
      }
    },
  }
  public static readonly rejectJoinRequestValidator = {
    query: {
      communityId: this.generalFields.mongoId.required(),
      userId: this.generalFields.mongoId.required(),
    },

    http() {
      return {
        query: joi
          .object<Pick<CommunityDTO.IAcceptJoinRequest, "communityId">>()
          .keys(this.query)
          .required(),
      }
    },

    graphql() {
      return {
        args: joi
          .object<Pick<CommunityDTO.IAcceptJoinRequest, "communityId">>()
          .keys(this.query)
          .required(),
      }
    },
  }

  public static readonly leaveCommunityValidator = {
    query: { communityId: this.generalFields.mongoId.required() },

    http() {
      return {
        query: joi
          .object<Pick<CommunityDTO.ILeaveCommunity, "communityId">>()
          .keys(this.query)
          .required(),
      }
    },

    graphql() {
      return {
        args: joi
          .object<Pick<CommunityDTO.IJoinCommunity, "communityId">>()
          .keys(this.query)
          .required(),
      }
    },
  }

  public static readonly addAdminValidator = {
    schema: {
      query: {
        userId: this.generalFields.mongoId.required(),
      },
      params: {
        communityId: this.generalFields.mongoId.required(),
      },
    },
    http() {
      return {
        query: joi
          .object<CommunityDTO.IAddAdmin>()
          .keys(this.schema.query)
          .required(),
        params: joi
          .object<CommunityDTO.IGetCommunity>()
          .keys(this.schema.params)
          .required(),
      }
    },

    graphql() {
      return {
        args: joi
          .object<CommunityDTO.IAddAdmin>()
          .keys({ ...this.schema.params, ...this.schema.query })
          .required(),
      }
    },
  }

  public static readonly removeAdminValidator = {
    schema: {
      params: {
        communityId: this.generalFields.mongoId.required(),
      },
      query: {
        adminId: this.generalFields.mongoId.required(),
      },
    },
    http() {
      return {
        query: joi
          .object<CommunityDTO.IRemoveAdmin>()
          .keys(this.schema.query)
          .required(),
        params: joi
          .object<CommunityDTO.IGetCommunity>()
          .keys(this.schema.params)
          .required(),
      }
    },

    graphql() {
      return {
        args: joi
          .object<CommunityDTO.IRemoveAdmin>()
          .keys({ ...this.schema.params, ...this.schema.query })
          .required(),
      }
    },
  }

  public static readonly kickOutValidator = {
    schema: {
      query: {
        userId: this.generalFields.mongoId.required(),
      },
      params: {
        communityId: this.generalFields.mongoId.required(),
      },
    },
    http() {
      return {
        query: joi
          .object<CommunityDTO.IKickOut>()
          .keys(this.schema.query)
          .required(),
        params: joi
          .object<CommunityDTO.IGetCommunity>()
          .keys(this.schema.params)
          .required(),
      }
    },

    graphql() {
      return {
        args: joi
          .object<CommunityDTO.IAddAdmin>()
          .keys({ ...this.schema.params, ...this.schema.query })
          .required(),
      }
    },
  }

  public static readonly addPostValidator = {
    body: joi
      .object<ICreatePost>()
      .keys({
        title: this.generalFields.body.min(1).max(28).required(),
        body: this.generalFields.body.max(500),
      })
      .required(),
    query: joi
      .object<CommunityDTO.IGetCommunity>()
      .keys({
        communityId: this.generalFields.mongoId.required(),
      })
      .required(),
  }

  public static readonly removePostValidator = {
    schema: {
      params: {
        communityId: this.generalFields.mongoId.required(),
      },
      query: {
        postId: this.generalFields.mongoId.required(),
      },
    },
    http() {
      return {
        query: joi.object<IPostId>().keys(this.schema.query).required(),
        params: joi
          .object<CommunityDTO.IGetCommunity>()
          .keys(this.schema.params)
          .required(),
      }
    },

    graphql() {
      return {
        args: joi
          .object<CommunityDTO.IGetCommunity>()
          .keys({ ...this.schema.params, ...this.schema.query })
          .required(),
      }
    },
  }

  public static readonly editValidator = {
    schema: {
      body: {
        name: this.generalFields.body.min(1).max(28),
        description: this.generalFields.body.max(500),
        isPrivateCommunity: joi.bool(),
      },

      query: {
        communityId: this.generalFields.mongoId.required(),
      },
    },

    http() {
      return {
        body: joi
          .object<CommunityDTO.IEditCommunity>()
          .keys(this.schema.body)
          .required(),
        query: joi
          .object<CommunityDTO.IGetCommunity>()
          .keys(this.schema.query)
          .required(),
      }
    },

    graphql() {
      return {
        args: joi
          .object<CommunityDTO.IEditCommunity>()
          .keys({ ...this.schema.query, ...this.schema.body })
          .required(),
      }
    },
  }

  public static readonly changeCoverValidator = {
    body: joi
      .object<CommunityDTO.IEditCommunity>()
      .keys({
        name: this.generalFields.body.min(1).max(28),
        description: this.generalFields.body.max(500),
      })
      .required(),
    query: joi
      .object<CommunityDTO.IGetCommunity>()
      .keys({
        communityId: this.generalFields.mongoId.required(),
      })
      .required(),
  }

  public static readonly changeVisibilityValidator = {
    schema: {
      query: {
        communityId: this.generalFields.mongoId.required(),
      },
    },

    http() {
      return {
        query: joi
          .object<CommunityDTO.IChangeCommunityVisibility>()
          .keys(this.schema.query)
          .required(),
      }
    },

    graphql() {
      return {
        args: joi
          .object<CommunityDTO.IChangeCommunityVisibility>()
          .keys(this.schema.query)
          .required(),
      }
    },
  }

  public static readonly deleteCommunityValidator = {
    schema: joi
      .object<CommunityDTO.IDeleteCommunity>()
      .keys({
        communityId: this.generalFields.mongoId.required(),
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
