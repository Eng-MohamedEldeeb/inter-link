import { MongoId } from '../../../common/types/db'
import { TGroup } from '../../../db/documents'
import { IGroupInputs } from '../../../db/interfaces/IGroup.interface'
import { UserDetails } from '../../../db/interfaces/INotification.interface'

export interface IGetSingle {
  groupId: MongoId
}

export interface ICreateGroup extends IGroupInputs {}

export interface IAddMember {
  groupId: MongoId
  memberId: MongoId
}

export interface IRemoveMember {
  groupId: MongoId
  memberId: MongoId
}

export interface ISendMessage {
  message: string
  from: UserDetails
  sentAt: string
}

export interface IDeleteChat extends IGetSingle {
  profileId: MongoId
  group: TGroup
}

export interface ILeaveChat extends IGetSingle {
  profileId: MongoId
  group: TGroup
}

export interface IGetSingleMessage extends IGetSingle {
  messageId: MongoId
}
export interface IDeleteMessage extends IGetSingle, IGetSingleMessage {
  group: TGroup
}

export interface ILikeMessage extends IGetSingle, IGetSingleMessage {}

export interface IEditMessage extends IGetSingle, IGetSingleMessage {
  newMessage: string
}
