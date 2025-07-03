import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql'
import { createHandler } from 'graphql-http/lib/use/express'

import * as auth from './auth/graphql/auh.module'
import * as profile from './profile/graphql/profile.module'
import * as user from './user/graphql/user.module'

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'mainRootQuery',
    fields: {
      profile: profile.queryModule,
      user: user.queryModule,
    },
  }),

  mutation: new GraphQLObjectType({
    name: 'mainRootMutation',
    fields: {
      auth: auth.mutationModule,
      profile: profile.mutationModule,
      user: user.mutationModule,
    },
  }),
})

const graphqlModule = createHandler({
  schema,
  context: function (req, _) {
    const { authorization } = req.raw.headers

    return { authorization }
  },
})

export default graphqlModule
