import { IUser } from "../../db/interfaces/IUser.interface"
import { Model } from "mongoose"
import { DataBaseService } from "../db.service"
import { TUser } from "../../db/documents"
import { User } from "../models"

class UserRepository extends DataBaseService<IUser, TUser> {
  constructor(private readonly userModel: Model<TUser> = User.Model) {
    super(userModel)
  }
}

export default new UserRepository()
