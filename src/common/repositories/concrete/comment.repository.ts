import { Model } from "mongoose"
import { IComment } from "../../../db/interfaces/IComment.interface"
import { DataBaseService } from "../abstract/db-service.repository"
import { TComment } from "../../../db/documents"
import { CommentModel } from "../../../db/models/Comment/Comment.model"

class CommentRepository extends DataBaseService<IComment, TComment> {
  constructor(private readonly commentModel: Model<TComment> = CommentModel) {
    super(commentModel)
  }
}

export default new CommentRepository()
