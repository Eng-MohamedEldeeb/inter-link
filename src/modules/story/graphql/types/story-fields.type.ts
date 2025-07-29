import {
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
import { IStory } from '../../../../db/interfaces/IStory.interface'

export const storyFields: ObjFields<Omit<IStory, '__v'>> = {
  _id: { type: GraphQLID },
  createdAt: { type: DateType },
  updatedAt: { type: DateType },
  attachment: { type: singleFile },
  content: { type: GraphQLString },
  createdBy: { type: GraphQLString },
  viewers: { type: new GraphQLList(GraphQLID) },
  likedBy: { type: new GraphQLList(GraphQLID) },
  totalViewers: { type: GraphQLInt },
}

export const oneStory = new GraphQLObjectType({
  name: 'onePost',
  fields: storyFields,
})
