import { GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql'

export const responseType = ({
  responseName,
  data,
}: {
  responseName: string
  data?: any
}) => {
  return new GraphQLObjectType({
    name: responseName,
    fields: {
      msg: { type: GraphQLString },
      status: { type: GraphQLInt },
      ...(data && { data: { type: data } }),
    },
  })
}
