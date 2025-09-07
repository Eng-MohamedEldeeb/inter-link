import { MongoId } from "../../../common/types/db"

export interface IGetUserProfile {
  user_id: MongoId
  username: string
}

export interface IBlockUser extends Pick<IGetUserProfile, "user_id"> {}

export interface IUnBlockUser extends IGetUserProfile {}

export interface IFollowUser extends Pick<IGetUserProfile, "user_id"> {}

export interface IUnFollowUser extends Pick<IGetUserProfile, "user_id"> {}

export interface IAcceptFollowRequest
  extends Pick<IGetUserProfile, "user_id"> {}

export interface IRejectFollowRequest
  extends Pick<IGetUserProfile, "user_id"> {}
