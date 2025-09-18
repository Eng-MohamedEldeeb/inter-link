import { MongoId } from "../../../../common/types/db"
import { IPostInputs } from "../../../../db/interfaces/IPost.interface"

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

export interface IEditPost extends Pick<ICreatePost, "title" | "body"> {}

export interface ILikePost extends IGetSinglePost {}
