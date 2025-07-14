import { returnedType } from '../../../common/decorators/resolver/returned-type.decorator'
import { ReplyController } from './reply.controller'

export const queryModule = (() => {
  return {
    type: returnedType({
      name: 'replyQuery',
      fields: {
        getCommentReplies: ReplyController.getCommentReplies(),
      },
    }),
    resolve: () => true,
  }
})()

export const mutationModule = (() => {
  return {
    type: returnedType({
      name: 'replyMutation',
      fields: {
        edit: ReplyController.edit(),
        delete: ReplyController.deleteReply(),
      },
    }),
    resolve: () => true,
  }
})()
