import { Model } from "mongoose"
import { IComment } from "../../db/interfaces/IComment.interface"
import { DataBaseService } from "../db.service"
import { TComment } from "../../db/documents"
import { Comment } from "../models"

class CommentRepository extends DataBaseService<IComment, TComment> {
  constructor(private readonly commentModel: Model<TComment> = Comment.Model) {
    super(commentModel)
  }
}

export default new CommentRepository()
