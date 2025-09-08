import { IGroup } from "../../../db/interfaces/IGroup.interface"
import { Model } from "mongoose"
import { DataBaseService } from "../abstract/db-service.repository"
import { TGroup } from "../../../db/documents"
import { GroupModel } from "../../../db/models/Group/Group.model"

class GroupRepository extends DataBaseService<IGroup, TGroup> {
  constructor(private readonly groupModel: Model<TGroup> = GroupModel) {
    super(groupModel)
  }
}

export default new GroupRepository()
