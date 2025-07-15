import { MongoId } from '../../../common/types/db/db.types'
import { IReplyInputs } from '../../../db/interface/IReply.interface'

export interface IGetCommentReplies {
  commentId: MongoId
}

export interface IAddReply extends IReplyInputs {}

export interface IReplyId {
  replyId: MongoId
}

export interface IEditReply extends Pick<IReplyInputs, 'content'>, IReplyId {}

export interface IDeleteReply extends IReplyId {}
