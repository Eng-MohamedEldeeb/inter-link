import { IComment } from '../../db/interface/IComment.interface'
import { Model } from 'mongoose'
import { DataBaseService } from './db-service.repository'
import { TComment } from '../../db/types/document.type'
import { CommentModel } from '../../db/models/Comment/Comment.model'

class CommentRepository extends DataBaseService<IComment, TComment> {
  constructor(protected readonly commentModel: Model<TComment> = CommentModel) {
    super(commentModel)
  }
}

export default new CommentRepository()
