import { Model } from 'mongoose'
import { IComment } from '../../db/interfaces/IComment.interface'
import { DataBaseService } from './db-service.repository'
import { TComment } from '../../db/documents'
import { CommentModel } from '../../db/models/Comment/Comment.model'

class CommentRepository extends DataBaseService<IComment, TComment> {
  constructor(protected readonly commentModel: Model<TComment> = CommentModel) {
    super(commentModel)
  }
}

export default new CommentRepository()
