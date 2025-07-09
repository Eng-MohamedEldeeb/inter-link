import { MongoId } from '../../../common/types/db/db.types'

export interface IGetUserProfileDTO {
  id: MongoId
  user: string
}

export interface IBlockUserDTO extends Pick<IGetUserProfileDTO, 'id'> {}

export interface IUnBlockUserDTO extends IGetUserProfileDTO {}
