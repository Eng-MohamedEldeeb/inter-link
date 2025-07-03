import { MongoObjId } from '../../../common/types/db/mongo.types'
import { IPostInputs } from '../../../db/interface/IPost.interface'

export interface IGetAllDTO {
  page: number
  limit: number
}

export interface IGetSinglePostDTO {
  id: MongoObjId
}

export interface ICreatePostDTO extends IPostInputs {}

export interface IEditPostDTO
  extends Pick<ICreatePostDTO, 'title' | 'content'> {}
