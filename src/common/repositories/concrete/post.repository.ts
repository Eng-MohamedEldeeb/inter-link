import { IPost } from "../../../db/interfaces/IPost.interface"
import { Model } from "mongoose"
import { DataBaseService } from "../abstract/db-service.repository"
import { TPost } from "../../../db/documents"
import { PostModel } from "../../../db/models/Post/Post.model"

class PostRepository extends DataBaseService<IPost, TPost> {
  constructor(private readonly postModel: Model<TPost> = PostModel) {
    super(postModel)
  }
}

export default new PostRepository()
