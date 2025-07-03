import { IGroup } from '../../db/interface/IGroup.interface'
import { Model } from 'mongoose'
import { DataBaseService } from './db-service.repository'
import { TGroup } from '../../db/types/document.type'
import { GroupModel } from '../../db/models/Group/Group.model'

class GroupRepository extends DataBaseService<IGroup, TGroup> {
  constructor(protected readonly groupModel: Model<TGroup> = GroupModel) {
    super(groupModel)
  }
}

export default new GroupRepository()
