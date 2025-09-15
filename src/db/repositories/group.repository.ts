import { IGroup } from "../../db/interfaces/IGroup.interface"
import { Model } from "mongoose"
import { DataBaseService } from "../db.service"
import { TGroup } from "../../db/documents"
import { Group } from "../models"

class GroupRepository extends DataBaseService<IGroup, TGroup> {
  constructor(private readonly groupModel: Model<TGroup> = Group.Model) {
    super(groupModel)
  }
}

export default new GroupRepository()
