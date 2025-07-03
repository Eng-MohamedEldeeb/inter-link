import { IPost } from '../../db/interface/IPost.interface'
import { Model } from 'mongoose'
import { DataBaseService } from './db-service.repository'
import { TPost } from '../../db/types/document.type'
import { PostModel } from '../../db/models/Post/Post.model'

class PostRepository extends DataBaseService<IPost, TPost> {
  constructor(protected readonly postModel: Model<TPost> = PostModel) {
    super(postModel)
  }
}

export default new PostRepository()
