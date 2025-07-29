import { GraphQLError, GraphQLObjectType, GraphQLSchema } from 'graphql'

import { createHandler } from 'graphql-http/lib/use/express'

import * as auth from './auth/graphql/auth.module'
import * as notification from './notification/graphql/notification.module'
import * as profile from './profile/graphql/profile.module'
import * as user from './user/graphql/user.module'
import * as post from './post/graphql/post.module'
import * as comment from './comment/graphql/comment.module'
import * as reply from './reply/graphql/reply.module'
import * as story from './story/graphql/story.module'
import * as group from './group/graphql/group.module'
import * as chat from './chat/graphql/chat.module'

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'mainRootQuery',
    fields: {
      notification: notification.queryModule,
      profile: profile.queryModule,
      user: user.queryModule,
      post: post.queryModule,
      comment: comment.queryModule,
      reply: reply.queryModule,
      story: story.queryModule,
      group: group.queryModule,
      chat: chat.queryModule,
    },
  }),

  mutation: new GraphQLObjectType({
    name: 'mainRootMutation',
    fields: {
      auth: auth.mutationModule,
      notification: notification.mutationModule,
      profile: profile.mutationModule,
      user: user.mutationModule,
      post: post.mutationModule,
      comment: comment.mutationModule,
      reply: reply.mutationModule,
      story: story.mutationModule,
      group: group.mutationModule,
      chat: chat.mutationModule,
    },
  }),
})

const graphqlModule = createHandler({
  schema,
  context: function (req, _) {
    const { authorization } = req.raw.headers

    return { authorization }
  },
  formatError(err) {
    return new GraphQLError(err.message, { originalError: err })
  },
})

export default graphqlModule
