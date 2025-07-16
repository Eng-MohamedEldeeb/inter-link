import { ICloudFile } from '../../../common/services/upload/interface/cloud-response.interface'
import { MongoId } from '../../../common/types/db/db.types'
import { ICommentInputs } from '../../../db/interface/IComment.interface'

export interface IGetSingleComment {
  id: MongoId
}

export interface IGetPostComments {
  postId: MongoId
}

export interface IAddComment
  extends Omit<ICommentInputs, 'replyingTo' | 'onPost'>,
    IGetPostComments {
  attachment: ICloudFile
}

export interface ICommentId {
  commentId: MongoId
}

export interface IEditComment
  extends Pick<ICommentInputs, 'content'>,
    ICommentId {}

export interface IDeleteComment extends ICommentId {}
