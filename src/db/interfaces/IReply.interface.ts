import { IComment, ICommentInputs } from './IComment.interface'
import { IUser } from './IUser.interface'

export interface IReplyInputs extends Pick<ICommentInputs, 'content'> {
  profile: IUser
  comment: IComment
}

export interface IReply
  extends Omit<
    IComment,
    'replies' | 'repliesCount' | 'onPost' | 'attachment'
  > {}
