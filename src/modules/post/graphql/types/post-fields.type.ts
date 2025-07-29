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

import { IPost } from '../../../../db/interfaces/IPost.interface'
import { multiFiles } from '../../../../common/services/upload/interface/cloud-response.interface'

export const postFields: ObjFields<
  Omit<IPost, '__v' | 'savedBy' | 'archivedAt'>
> = {
  _id: { type: GraphQLID },
  createdAt: { type: DateType },
  updatedAt: { type: DateType },
  attachments: { type: multiFiles },
  title: { type: GraphQLString },
  content: { type: GraphQLString },
  createdBy: { type: GraphQLString },
  totalComments: { type: GraphQLInt },
  totalLikes: { type: GraphQLInt },
  likedBy: { type: new GraphQLList(GraphQLID) },
  comments: { type: new GraphQLList(GraphQLID) },
  onGroup: { type: GraphQLID },
  totalSaves: { type: GraphQLInt },
  shares: { type: GraphQLInt },
}

export const onePost = new GraphQLObjectType({
  name: 'onePost',
  fields: postFields,
})
