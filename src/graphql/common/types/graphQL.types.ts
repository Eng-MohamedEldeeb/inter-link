import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLString,
} from 'graphql'

export const DateType = new GraphQLScalarType({
  name: 'Date',
  parseValue(value) {
    return new Date(value as string)
  },
  serialize(value) {
    const v = value as number
    return new Date(v).toISOString()
  },
})

export const oneFileResponse = new GraphQLObjectType({
  name: 'oneFileResponse',
  fields: {
    folderId: { type: GraphQLString },
    public_id: { type: GraphQLID },
    secure_url: { type: GraphQLString },
  },
})
