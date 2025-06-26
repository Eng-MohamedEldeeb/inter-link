import { ProfileService } from './profile.service'
import {
  IContext,
  ISuccessResponse,
} from '../../../common/interface/graphql/IGraphQL.types'
import { IUser } from '../../../db/models/interfaces/IUser.interface'

export class ProfileResolver {
  protected static readonly ProfileService = ProfileService

  static readonly getProfile = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const user: IUser = context.profile
    return {
      msg: 'done',
      status: 200,
      data: await this.ProfileService.getProfile(user),
    }
  }
}
