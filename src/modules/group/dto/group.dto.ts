import { MongoId } from '../../../common/types/db'
import { TGroup } from '../../../db/documents'
import { IGroupInputs } from '../../../db/interfaces/IGroup.interface'
import { UserDetails } from '../../../db/interfaces/INotification.interface'

export interface IGetSingleGroup {
  id: MongoId
}

export interface ICreateGroup extends IGroupInputs {}

export interface IAddMember {
  id: MongoId
  memberId: MongoId
}

export interface IRemoveMember {
  id: MongoId
  memberId: MongoId
}

export interface ISendMessage {
  message: string
  from: UserDetails
  sentAt: string
}

export interface IUpdateGroup extends IGetSingleGroup, IGroupInputs {}

export interface IDeleteGroup extends IGetSingleGroup {
  profileId: MongoId
}

export interface ILeaveGroup extends IGetSingleGroup {
  profileId: MongoId
  group: TGroup
}

export interface IGetSingleMessage extends IGetSingleGroup {
  messageId: MongoId
}
export interface IDeleteMessage extends IGetSingleGroup, IGetSingleMessage {
  group: TGroup
}

export interface ILikeMessage extends IGetSingleGroup, IGetSingleMessage {}

export interface IEditMessage extends IGetSingleGroup, IGetSingleMessage {
  newMessage: string
}
