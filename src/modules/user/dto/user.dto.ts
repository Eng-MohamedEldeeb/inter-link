import { MongoObjId } from '../../../common/types/db/mongo.types'

export interface IGetUserProfileDTO {
  id: MongoObjId
  user: string
}

export interface IBlockUserDTO extends IGetUserProfileDTO {}

export interface IUnBlockUserDTO extends IGetUserProfileDTO {}
