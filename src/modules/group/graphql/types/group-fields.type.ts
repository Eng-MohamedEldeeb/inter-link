import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

import {
  DateType,
  ObjFields,
} from '../../../../common/types/graphql/graphql.types'

import { singleFile } from '../../../../common/services/upload/interface/cloud-response.interface'
import { IGroup } from '../../../../db/interface/IGroup.interface'

export const groupFields: ObjFields<Omit<IGroup, '__v'>> = {
  _id: { type: GraphQLID },
  createdAt: { type: DateType },
  updatedAt: { type: DateType },
  cover: { type: singleFile },
  name: { type: GraphQLString },
  slug: { type: GraphQLString },
  description: { type: GraphQLString },
  admins: { type: new GraphQLList(GraphQLID) },
  members: { type: new GraphQLList(GraphQLID) },
  totalMembers: { type: GraphQLInt },
  posts: { type: new GraphQLList(GraphQLID) },
  isPrivateGroup: { type: GraphQLBoolean },
  createdBy: { type: GraphQLString },
}

export const oneGroup = new GraphQLObjectType({
  name: 'oneGroup',
  fields: groupFields,
})
