import { IUser } from "../../db/interfaces/IUser.interface"
import { Model } from "mongoose"
import { DataBaseService } from "../services/db/db.service"
import { TUser } from "../../db/documents"
import { UserModel } from "../../db/models/User/User.model"

class UserRepository extends DataBaseService<IUser, TUser> {
  constructor(private readonly userModel: Model<TUser> = UserModel) {
    super(userModel)
  }
}

export default new UserRepository()
