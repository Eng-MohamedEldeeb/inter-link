import { UserService } from './user.service'
import {
  IContext,
  ISuccessResponse,
} from '../../common/interface/IGraphQL.types'
import { IUser } from '../../../db/models/interfaces/IUser.interface'

export class UserResolver {
  protected static readonly UserService = UserService

  static readonly getProfile = async (
    _: any,
    context: IContext,
  ): Promise<ISuccessResponse> => {
    const { _id } = context.tokenPayload
    const user: IUser = context.user
    return {
      msg: 'done',
      status: 200,
      data: await this.UserService.getProfile(_id, user),
    }
  }
}
