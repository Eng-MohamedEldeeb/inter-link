import { MongoId } from '../../../common/types/db/db.types'
import { IGroupInputs } from '../../../db/interface/IGroup.interface'

export interface IGetGroup {
  groupId: MongoId
}

export interface ICreateGroup extends IGroupInputs {}

export interface IAddAdmin extends IGetGroup {
  userId: MongoId
}

export interface IRemoveAdmin extends IGetGroup {
  adminId: MongoId
}

export interface IRemovePost extends IGetGroup {
  postId: MongoId
}

export interface IEditGroup
  extends Pick<ICreateGroup, 'name' | 'description' | 'isPrivateGroup'>,
    IGetGroup {}

export interface IDeleteGroup extends IGetGroup {}

export interface IChangeGroupVisibility extends IGetGroup {}

export interface IJoinGroup extends IGetGroup {}

export interface ILeaveGroup extends IGetGroup {}
