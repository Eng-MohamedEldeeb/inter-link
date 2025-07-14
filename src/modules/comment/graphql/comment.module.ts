import { returnedType } from '../../../common/decorators/resolver/returned-type.decorator'
import { CommentController } from './comment.controller'

export const queryModule = (() => {
  return {
    type: returnedType({
      name: 'commentQuery',
      fields: {
        getSingleComment: CommentController.getSingleComment(),
      },
    }),
    resolve: () => true,
  }
})()

export const mutationModule = (() => {
  return {
    type: returnedType({
      name: 'commentMutation',
      fields: {
        edit: CommentController.edit(),
        delete: CommentController.deleteComment(),
      },
    }),
    resolve: () => true,
  }
})()
