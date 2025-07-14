import { MongoId } from '../../../common/types/db/db.types'
import { IReplyInputs } from '../../../db/interface/IReply.interface'

export interface IGetCommentRepliesDTO {
  commentId: MongoId
}

export interface IAddReplyDTO extends IReplyInputs {}

export interface IReplyIdDTO {
  replyId: MongoId
}

export interface IEditReplyDTO
  extends Pick<IReplyInputs, 'content'>,
    IReplyIdDTO {}

export interface IDeleteReplyDTO extends IReplyIdDTO {}
