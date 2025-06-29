import { ProfileService } from './profile.service'
import {
  IContext,
  ISuccessResponse,
} from '../../../common/interface/graphql/IGraphQL.types'

export class ProfileResolver {
  protected static readonly ProfileService = ProfileService

  static readonly getProfile = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    return {
      msg: 'done',
      status: 200,
      data: await this.ProfileService.getProfile(),
    }
  }
}
