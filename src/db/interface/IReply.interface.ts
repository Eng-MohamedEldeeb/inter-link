import { IComment } from './IComment.interface'

export interface IReplyInputs
  extends Pick<IComment, 'content' | 'replyingTo' | 'createdBy'> {}

export interface IReply
  extends Omit<
    IComment,
    'replies' | 'repliesCount' | 'onPost' | 'attachment'
  > {}
