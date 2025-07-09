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
import { IPost } from '../../../../db/interface/IPost.interface'
import { singleFileResponse } from '../../../../common/services/upload/interface/cloud-response.interface'

export const postFields: ObjFields<Omit<IPost, '__v'>> = {
  _id: { type: GraphQLID },
  createdAt: { type: DateType },
  updatedAt: { type: DateType },
  attachments: { type: new GraphQLList(singleFileResponse) },
  title: { type: GraphQLString },
  content: { type: GraphQLString },
  createdBy: { type: GraphQLString },
  totalComments: { type: GraphQLInt },
  totalLikes: { type: GraphQLInt },
  likedBy: { type: new GraphQLList(GraphQLID) },
  comments: { type: new GraphQLList(GraphQLID) },
  archivedAt: { type: DateType },
  onGroup: { type: GraphQLID },
  saves: { type: GraphQLInt },
  shares: { type: GraphQLInt },
}

export const onePost = new GraphQLObjectType({
  name: 'onePost',
  fields: postFields,
})
