import { MongoId } from '../../../common/types/db/db.types'
import { ICommentInputs } from '../../../db/interface/IComment.interface'

export interface IGetPostCommentsDTO {
  postId: MongoId
}

export interface IAddCommentDTO
  extends Omit<ICommentInputs, 'replyingTo' | 'onPost'> {}

export interface ICommentIdDTO {
  commentId: MongoId
}

export interface IEditCommentDTO extends Pick<ICommentInputs, 'content'> {}
