import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql'
import { createHandler } from 'graphql-http/lib/use/express'

import * as auth from './auth/graphql/auh.module'
import * as profile from './profile/graphql/profile.module'

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'mainRootQuery',
    fields: {
      profile: profile.queryModule,
    },
  }),

  mutation: new GraphQLObjectType({
    name: 'mainRootMutation',
    fields: {
      //     auth: { type: auth.mutationModule },
      profile: profile.mutationModule,
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
