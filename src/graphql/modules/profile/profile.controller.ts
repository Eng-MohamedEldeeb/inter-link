import { ProfileResolver } from './profile.resolver'
import { applyResolver } from '../../common/decorators/apply-resolver.decorator'
import { IQueryController } from '../../common/interface/IGraphQL.types'
import { responseType } from '../../common/handler/response-type.handler'
import isAuthenticatedGuard from '../../common/guards/is-authenticated.guard'
import isAuthorizedGuard from '../../common/guards/is-authorized.guard'
import { oneProfileResponse } from './types/profile-response.types'

export class ProfileController {
  private static readonly ProfileResolver = ProfileResolver

  static readonly getProfile = (): IQueryController => {
    return {
      type: responseType({
        responseName: 'getProfileResponse',
        data: oneProfileResponse,
      }),
      resolve: applyResolver({
        applyGuards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.ProfileResolver.getProfile,
      }),
    }
  }
}
