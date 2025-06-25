import { GraphQLObjectType, GraphQLSchema } from 'graphql'
import { createHandler } from 'graphql-http/lib/use/express'
import { profileQueryFields } from './modules/profile/profile.module'
import { RequestParams } from 'graphql-http'

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'mainRootQuery',
    fields: {
      ...profileQueryFields(),
    },
  }),
})

const graphqlModule = createHandler({
  schema,
  context: function (req, _: RequestParams) {
    const { authorization } = req.raw.headers

    return { authorization }
  },
})

export default graphqlModule
