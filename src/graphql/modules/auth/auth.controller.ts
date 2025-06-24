import { GraphQLObjectType, GraphQLString } from 'graphql'
import { AuthResolver } from './auth.resolver'
import {
  IConfirmEmailDto,
  IForgotPasswordDto,
  ILoginDto,
  IResetPasswordDto,
  IRegisterDto,
} from './dto/auth.dto'
import { applyResolver } from '../../common/decorators/apply-resolver.decorator'
import { IMutationController } from '../../common/interface/IGraphQL.types'
import * as args from './types/auth.args'
import { validate } from '../../middlewares/validation.middleware'
import * as validators from './validator/auth.validator'
import { responseType } from '../../common/handler/response-type.handler'

export class AuthController {
  private static readonly AuthResolver = AuthResolver

  static readonly confirmEmail = (): IMutationController => {
    return {
      type: responseType({ responseName: 'confirmEmailResponse' }),
      args: args.confirmEmailArgs(),
      resolve: applyResolver<IConfirmEmailDto>({
        applyMiddlewares: [validate(validators.confirmEmailSchema)],
        resolver: this.AuthResolver.confirmEmail,
      }),
    }
  }

  static readonly register = (): IMutationController => {
    return {
      type: responseType({ responseName: 'registerResponse' }),
      args: args.registerArgs(),
      resolve: applyResolver<IRegisterDto>({
        applyMiddlewares: [validate(validators.registerSchema)],
        resolver: this.AuthResolver.register,
      }),
    }
  }

  static readonly login = (): IMutationController => {
    return {
      type: responseType({
        responseName: 'loginResponse',
        data: new GraphQLObjectType({
          name: 'accessTokenResponse',
          fields: { accessToken: { type: GraphQLString } },
        }),
      }),
      args: args.loginArgs(),
      resolve: applyResolver<ILoginDto>({
        applyMiddlewares: [validate(validators.loginSchema)],
        resolver: this.AuthResolver.login,
      }),
    }
  }

  static readonly forgotPassword = (): IMutationController => {
    return {
      type: responseType({ responseName: 'forgotPasswordResponse' }),
      args: args.forgotPasswordArgs(),
      resolve: applyResolver<IForgotPasswordDto>({
        applyMiddlewares: [validate(validators.forgotPasswordSchema)],
        resolver: this.AuthResolver.forgotPassword,
      }),
    }
  }

  static readonly resetPassword = (): IMutationController => {
    return {
      type: responseType({ responseName: 'resetPasswordResponse' }),
      args: args.resetPasswordArgs(),
      resolve: applyResolver<IResetPasswordDto>({
        applyMiddlewares: [validate(validators.resetPasswordSchema)],
        resolver: this.AuthResolver.resetPassword,
      }),
    }
  }
}
