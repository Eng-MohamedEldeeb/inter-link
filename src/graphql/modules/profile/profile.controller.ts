import { ProfileResolver } from './profile.resolver'
import { applyResolver } from '../../../common/decorators/graphql/apply-resolver.decorator'
import { IQueryController } from '../../../common/interface/graphql/IGraphQL.types'
import { responseType } from '../../../common/handlers/graphql/response-type.handler'
import { oneProfileResponse } from './types/profile-response.types'
import { applyGuardsActivator } from '../../../common/decorators/apply-guards-activator.decorator'
import isAuthenticatedGuard from '../../../common/guards/is-authenticated.guard'
import isAuthorizedGuard from '../../../common/guards/is-authorized.guard'

export class ProfileController {
  private static readonly ProfileResolver = ProfileResolver

  static readonly getProfile = (): IQueryController => {
    return {
      type: responseType({
        responseName: 'getProfileResponse',
        data: oneProfileResponse,
      }),
      resolve: applyResolver({
        applyMiddlewares: [
          applyGuardsActivator(isAuthenticatedGuard, isAuthorizedGuard),
        ],
        resolver: this.ProfileResolver.getProfile,
      }),
    }
  }
}
