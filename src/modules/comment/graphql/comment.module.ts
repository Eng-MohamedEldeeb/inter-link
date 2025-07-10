import { returnedType } from '../../../common/decorators/resolver/returned-type.decorator'
import { CommentController } from './comment.controller'

export const queryModule = (() => {
  return {
    type: returnedType({
      name: 'commentQuery',
      fields: {
        getPostComments: CommentController.getPostComments(),
      },
    }),
    resolve: () => true,
  }
})()
