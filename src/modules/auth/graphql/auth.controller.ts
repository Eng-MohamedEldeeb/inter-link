import { IMutationController } from '../../../common/decorators/graphql/types/IGraphQL.interface'
import { applyResolver } from '../../../common/decorators/graphql/apply-resolver.decorator'

import { returnedResponseType } from '../../../common/decorators/graphql/returned-type.decorator'

import * as args from './types/auth-args.type'

import { validate } from '../../../common/middlewares/validation/validation.middleware'
import * as validators from './../validator/auth.validator'

import { AuthResolver } from './auth.resolver'

export class AuthController {
  private static readonly AuthResolver = AuthResolver

  static readonly confirmEmail = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'confirmEmail',
      }),
      args: args.confirmEmail,
      resolve: applyResolver({
        middlewares: [validate(validators.confirmEmailSchema.graphQL())],
        resolver: this.AuthResolver.confirmEmail,
      }),
    }
  }

  static readonly register = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'register',
      }),
      args: args.register,
      resolve: applyResolver({
        middlewares: [validate(validators.registerSchema.graphQL())],
        resolver: this.AuthResolver.register,
      }),
    }
  }

  static readonly login = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'login',
      }),
      args: args.login,
      resolve: applyResolver({
        middlewares: [validate(validators.loginSchema.graphQL())],
        resolver: this.AuthResolver.login,
      }),
    }
  }

  static readonly forgotPassword = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'forgotPassword',
      }),
      args: args.forgotPassword,
      resolve: applyResolver({
        middlewares: [validate(validators.forgotPasswordSchema.graphQL())],
        resolver: this.AuthResolver.forgotPassword,
      }),
    }
  }

  static readonly resetPassword = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'resetPassword',
      }),
      args: args.resetPassword,
      resolve: applyResolver({
        middlewares: [validate(validators.resetPasswordSchema.graphQL())],
        resolver: this.AuthResolver.resetPassword,
      }),
    }
  }
}
