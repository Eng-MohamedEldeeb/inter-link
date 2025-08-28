import { MongoId } from '../../../common/types/db'
import { ICommunityInputs } from '../../../db/interfaces/ICommunity.interface'
import { IPostId } from '../../post/dto/post.dto'

export interface IGetCommunity {
  communityId: MongoId
}

export interface ICreateCommunity extends ICommunityInputs {}

export interface IAddAdmin extends IGetCommunity {
  userId: MongoId
}

export interface IJoinCommunity extends IAddAdmin {}

export interface ILeaveCommunity extends IAddAdmin {}

export interface IAcceptJoinRequest extends IAddAdmin {}

export interface IRejectJoinRequest extends IAddAdmin {}

export interface IKickOut extends IAddAdmin {}

export interface IRemoveAdmin extends IGetCommunity {
  adminId: MongoId
}

export interface IRemovePost extends IGetCommunity, IPostId {}

export interface IEditCommunity
  extends Pick<ICreateCommunity, 'name' | 'description'>,
    IGetCommunity {}

export interface IDeleteCommunity extends IGetCommunity {}

export interface IChangeCommunityVisibility extends IGetCommunity {}
