import { MongoId } from '../../../common/types/db/db.types'
import { IPostInputs } from '../../../db/interface/IPost.interface'

export interface IGetAllDTO {
  page: number
  limit: number
}

export interface IGetSinglePostDTO {
  id: MongoId
}

export interface ICreatePostDTO extends IPostInputs {}

export interface IEditPostDTO
  extends Pick<ICreatePostDTO, 'title' | 'content'> {}
