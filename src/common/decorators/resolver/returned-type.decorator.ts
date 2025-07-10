import { GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql'
import { ObjFields } from '../../types/graphql/graphql.types'

export const argsType = <Interface>(fields: ObjFields<Interface>) => {
  return fields
}

export const returnedType = <Interface>({
  name,
  fields,
}: {
  name: string
  fields: ObjFields<Interface>
}) => {
  return new GraphQLObjectType({
    name,
    fields,
  })
}

export const returnedResponseType = ({
  name,
  data,
}: {
  name: string
  data?: any
}) => {
  return returnedType({
    name,
    fields: {
      msg: { type: GraphQLString },
      status: { type: GraphQLInt },
      ...(data && { data: { type: data } }),
    },
  })
}
