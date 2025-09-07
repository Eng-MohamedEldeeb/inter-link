import { GraphQLObjectType, GraphQLString } from "graphql"

import { AuthArgs } from "./types/auth-args"
import authResolver from "./auth.resolver"

import * as validators from "./../validator/auth.validator"

import { IMutationController } from "../../../common/interface/IGraphQL.interface"
import { applyResolver } from "../../../common/decorators/resolver/apply-resolver.decorator"
import { graphResponseType } from "../../../common/decorators/resolver/returned-type.decorator"
import { validate } from "../../../common/middlewares/validation/validation.middleware"

class AuthController {
  private readonly authResolver = authResolver

  public readonly confirmEmail = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "confirmEmail",
      }),
      args: AuthArgs.confirmEmail,
      resolve: applyResolver({
        middlewares: [validate(validators.confirmEmailSchema.graphql())],
        resolver: this.authResolver.confirmEmail,
      }),
    }
  }

  public readonly register = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "register",
      }),
      args: AuthArgs.register,
      resolve: applyResolver({
        middlewares: [validate(validators.registerSchema.graphql())],
        resolver: this.authResolver.register,
      }),
    }
  }

  public readonly login = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "login",
        data: new GraphQLObjectType({
          name: "loginResponseData",
          fields: {
            accessToken: {
              type: GraphQLString,
            },
          },
        }),
      }),
      args: AuthArgs.login,
      resolve: applyResolver({
        middlewares: [validate(validators.loginSchema.graphql())],
        resolver: this.authResolver.login,
      }),
    }
  }

  public readonly forgotPassword = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "forgotPassword",
      }),
      args: AuthArgs.forgotPassword,
      resolve: applyResolver({
        middlewares: [validate(validators.forgotPasswordSchema.graphql())],
        resolver: this.authResolver.forgotPassword,
      }),
    }
  }

  public readonly resetPassword = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "resetPassword",
      }),
      args: AuthArgs.resetPassword,
      resolve: applyResolver({
        middlewares: [validate(validators.resetPasswordSchema.graphql())],
        resolver: this.authResolver.resetPassword,
      }),
    }
  }
}
export default new AuthController()
