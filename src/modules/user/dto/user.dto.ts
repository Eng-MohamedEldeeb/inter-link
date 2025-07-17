import { MongoId } from '../../../common/types/db/db.types'

export interface IGetUserProfile {
  id: MongoId
  username: string
}

export interface IBlockUser extends Pick<IGetUserProfile, 'id'> {}

export interface IUnBlockUser extends IGetUserProfile {}
