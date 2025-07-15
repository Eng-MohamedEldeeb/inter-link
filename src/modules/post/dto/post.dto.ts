import { MongoId } from '../../../common/types/db/db.types'
import { IPostInputs } from '../../../db/interface/IPost.interface'

export interface IGetAll {
  page: number
  limit: number
}

export interface IGetSinglePost {
  id: MongoId
}

export interface ICreatePost extends IPostInputs {}

export interface IEditPost extends Pick<ICreatePost, 'title' | 'content'> {}
