import { GraphQLObjectType, GraphQLSchema } from 'graphql'
import { createHandler } from 'graphql-http/lib/use/express'
import { profileQueryFields } from './modules/profile/profile.module'

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
  context: function (req, _) {
    const { authorization } = req.raw.headers

    return { authorization }
  },
})

export default graphqlModule
