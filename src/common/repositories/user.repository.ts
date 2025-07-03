import { IUser } from '../../db/interface/IUser.interface'
import { Model } from 'mongoose'
import { DataBaseService } from './db-service.repository'
import { TUser } from '../../db/types/document.type'
import { UserModel } from '../../db/models/User/User.model'

class UserRepository extends DataBaseService<IUser, TUser> {
  constructor(protected readonly userModel: Model<TUser> = UserModel) {
    super(userModel)
  }
}

export default new UserRepository()
