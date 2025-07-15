import { MongoId } from '../../../common/types/db/db.types'
import { IGroupInputs } from '../../../db/interface/IGroup.interface'

export interface IGetGroup {
  id: MongoId
}

export interface ICreateGroup extends IGroupInputs {}

export interface IEditGroup extends ICreateGroup {}

export interface IDeleteGroup extends IGetGroup {}

export interface IChangeGroupVisibility extends IGetGroup {}

export interface IJoinGroup extends IGetGroup {}

export interface ILeaveGroup extends IGetGroup {}
