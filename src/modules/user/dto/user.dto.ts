import { MongoId } from '../../../common/types/db/db.types'

export interface IGetUserProfile {
  id: MongoId
  username: string
}

export interface IBlockUser extends Pick<IGetUserProfile, 'id'> {}

export interface IUnBlockUser extends IGetUserProfile {}

export interface IFollowUser extends Pick<IGetUserProfile, 'id'> {}

export interface IUnFollowUser extends Pick<IGetUserProfile, 'id'> {}

export interface IAcceptFollowRequest extends Pick<IGetUserProfile, 'id'> {}

export interface IRejectFollowRequest extends Pick<IGetUserProfile, 'id'> {}
