import { GraphQLObjectType, GraphQLString } from "graphql"

import authResolver from "./auth.resolver"

import { AuthValidator } from "../../../../validators"

import { AuthArgs } from "./types/auth-args"
import { IMutationController } from "../../../../common/interface/IGraphQL.interface"
import { applyResolver } from "../../../../common/decorators/resolver/apply-resolver.decorator"
import { graphResponseType } from "../../../../common/decorators/resolver/returned-type.decorator"
import { validate } from "../../../../common/middlewares/validation/validation.middleware"

class AuthController {
  private readonly authResolver = authResolver

  public readonly confirmEmail = (): IMutationController => {
    return {
      type: graphResponseType({
        name: "confirmEmail",
      }),
      args: AuthArgs.confirmEmail,
      resolve: applyResolver({
        middlewares: [validate(AuthValidator.confirmEmailValidator.graphql())],
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
        middlewares: [validate(AuthValidator.registerValidator.graphql())],
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
        middlewares: [validate(AuthValidator.loginValidator.graphql())],
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
        middlewares: [
          validate(AuthValidator.forgotPasswordValidator.graphql()),
        ],
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
        middlewares: [validate(AuthValidator.resetPasswordValidator.graphql())],
        resolver: this.authResolver.resetPassword,
      }),
    }
  }
}
export default new AuthController()
