import { Types } from 'mongoose'

export interface IGetUserProfileDTO {
  id: Types.ObjectId
}

export interface IBlockUserDTO extends IGetUserProfileDTO {}

export interface IUnBlockUserDTO extends IGetUserProfileDTO {}
