import { GraphQLObjectType, GraphQLSchema } from 'graphql'
import { createHandler, HandlerOptions } from 'graphql-http/lib/use/express'
import { authMutationFields } from './modules/auth/auth.module'
import { userQueryFields } from './modules/user/user.module'
import { RequestParams } from 'graphql-http'

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'mainRootQuery',
    fields: {
      ...userQueryFields(),
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'mainRootMutation',
    fields: {
      ...authMutationFields(),
    },
  }),
})

const graphqlModule = createHandler({
  schema,
  context: function (req, params: RequestParams) {
    const { authorization } = req.raw.headers

    return { authorization }
  },
})

export default graphqlModule
