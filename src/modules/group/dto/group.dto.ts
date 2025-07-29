import { MongoId } from '../../../common/types/db'
import { IGroupInputs } from '../../../db/interfaces/IGroup.interface'
import { IPostId } from '../../post/dto/post.dto'

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

export interface IRemovePost extends IGetGroup, IPostId {}

export interface IEditGroup
  extends Pick<ICreateGroup, 'name' | 'description'>,
    IGetGroup {}

export interface IDeleteGroup extends IGetGroup {}

export interface IChangeGroupVisibility extends IGetGroup {}

export interface IJoinGroup extends IGetGroup {}

export interface ILeaveGroup extends IGetGroup {}
