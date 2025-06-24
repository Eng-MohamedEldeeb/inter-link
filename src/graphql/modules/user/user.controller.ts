import { GraphQLObjectType, GraphQLString } from 'graphql'
import { UserResolver } from './user.resolver'
import { applyResolver } from '../../common/decorators/apply-resolver.decorator'
import { IQueryController } from '../../common/interface/IGraphQL.types'
import { validate } from '../../middlewares/validation.middleware'
import * as validators from './validator/user.validator'
import { responseType } from '../../common/handler/response-type.handler'
import isAuthenticatedGuard from '../../common/guards/is-authenticated.guard'
import isAuthorizedGuard from '../../common/guards/is-authorized.guard'
import { oneUserResponse } from './types/user-response.types'

export class UserController {
  private static readonly UserResolver = UserResolver

  static readonly getProfile = (): IQueryController => {
    return {
      type: responseType({
        responseName: 'getProfileResponse',
        data: oneUserResponse,
      }),
      resolve: applyResolver({
        applyGuards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.UserResolver.getProfile,
      }),
    }
  }
}
