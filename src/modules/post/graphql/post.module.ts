import { returnedType } from '../../../common/decorators/graphql/returned-type.decorator'
import { PostController } from './post.controller'

export const queryModule = (() => {
  return {
    type: returnedType({
      name: 'postQuery',
      fields: {
        getAll: PostController.getAll(),
        getSingle: PostController.getSingle(),
      },
    }),
    resolve: () => true,
  }
})()

export const mutationModule = (() => {
  return {
    type: returnedType({
      name: 'postMutation',
      fields: {
        edit: PostController.edit(),
        save: PostController.save(),
        shared: PostController.shared(),
        archive: PostController.archive(),
        restore: PostController.restore(),
        deletePost: PostController.deletePost(),
      },
    }),
    resolve: () => true,
  }
})()
