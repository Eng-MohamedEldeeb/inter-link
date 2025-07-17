import { ICloudFile } from '../../../common/services/upload/interface/cloud-response.interface'
import { MongoId } from '../../../common/types/db/db.types'
import { ICommentInputs } from '../../../db/interface/IComment.interface'
import { IPostId } from '../../post/dto/post.dto'

export interface IGetSingleComment {
  id: MongoId
}

export interface IAddComment
  extends Omit<ICommentInputs, 'replyingTo' | 'onPost'>,
    IPostId {
  attachment: ICloudFile
}

export interface ICommentId {
  commentId: MongoId
}

export interface IGetSingleComment {
  id: MongoId
}

export interface IEditComment
  extends Pick<ICommentInputs, 'content'>,
    IGetSingleComment {}

export interface IDeleteComment extends IGetSingleComment {}
