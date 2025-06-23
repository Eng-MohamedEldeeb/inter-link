import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql'
import { createHandler } from 'graphql-http/lib/use/express'

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'mainRootQuery',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => {
          return 'hello'
        },
      },
    },
  }),
})

const graphqlModule = createHandler({ schema })

export default graphqlModule
