import { GraphQLError, GraphQLObjectType, GraphQLSchema } from "graphql"

import { createHandler } from "graphql-http/lib/use/express"

import * as auth from "./auth/graphql/auth.module"
import * as notification from "./notification/graphql/notification.module"
import * as profile from "./profile/graphql/profile.module"
import * as user from "./user/graphql/user.module"
import * as post from "./post/graphql/post.module"
import * as comment from "./comment/graphql/comment.module"
import * as reply from "./reply/graphql/reply.module"
import * as story from "./story/graphql/story.module"
import * as community from "./community/graphql/community.module"
// import * as chat from "./chat/graphql/chat.module"

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "mainRootQuery",
    fields: {
      notifications: notification.queryModule,
      profile: profile.queryModule,
      users: user.queryModule,
      posts: post.queryModule,
      comments: comment.queryModule,
      replies: reply.queryModule,
      stories: story.queryModule,
      communities: community.queryModule,
      // chats: chat.queryModule,
    },
  }),

  mutation: new GraphQLObjectType({
    name: "mainRootMutation",
    fields: {
      auth: auth.mutationModule,
      notifications: notification.mutationModule,
      profile: profile.mutationModule,
      users: user.mutationModule,
      posts: post.mutationModule,
      comments: comment.mutationModule,
      replies: reply.mutationModule,
      stories: story.mutationModule,
      communities: community.mutationModule,
      // chats: chat.mutationModule,
    },
  }),
})

const graphqlModule = createHandler({
  schema,
  context: function (req, _) {
    const { authorization } = req.raw.headers

    return { authorization }
  },
  // formatError(err) {
  //   return new GraphQLError(err.message, { originalError: err })
  // },
})

export default graphqlModule
