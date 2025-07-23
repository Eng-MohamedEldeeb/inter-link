import { MongoId } from '../../../common/types/db/db.types'
import { IPostInputs } from '../../../db/interface/IPost.interface'

export interface IGetAll {
  page: number
  limit: number
}

export interface IPostId {
  postId: MongoId
}
export interface IGetSinglePost {
  id: MongoId
}

export interface ICreatePost extends IPostInputs {}

export interface IEditPost extends Pick<ICreatePost, 'title' | 'content'> {}

export interface ILikePost extends IGetSinglePost {}
