import { IPost } from "../../db/interfaces/IPost.interface"
import { Model } from "mongoose"
import { DataBaseService } from "../db.service"
import { TPost } from "../../db/documents"
import { Post } from "../models"

class PostRepository extends DataBaseService<IPost, TPost> {
  constructor(private readonly postModel: Model<TPost> = Post.Model) {
    super(postModel)
  }
}

export default new PostRepository()
