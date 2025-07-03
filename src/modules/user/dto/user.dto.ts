import { MongoObjId } from '../../../common/types/db/mongo.types'

export interface IGetUserProfileDTO {
  id: MongoObjId
  user: string
}

export interface IBlockUserDTO extends Pick<IGetUserProfileDTO, 'id'> {}

export interface IUnBlockUserDTO extends IGetUserProfileDTO {}
