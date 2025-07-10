import { singleFile } from './../../../../common/services/upload/interface/cloud-response.interface'
import { GraphQLID, GraphQLInt, GraphQLList, GraphQLString } from 'graphql'
import {
  DateType,
  ObjFields,
} from '../../../../common/types/graphql/graphql.types'
import { IComment } from '../../../../db/interface/IComment.interface'

export const commentFields: ObjFields<Omit<IComment, '__v'>> = {
  _id: { type: GraphQLID },
  createdAt: { type: DateType },
  updatedAt: { type: DateType },

  content: {
    type: GraphQLString,
  },

  likedBy: {
    type: new GraphQLList(GraphQLID),
  },
  totalLikes: {
    type: GraphQLInt,
  },

  replies: {
    type: new GraphQLList(GraphQLID),
  },

  repliesCount: {
    type: GraphQLInt,
  },
  onPost: {
    type: GraphQLID,
  },

  createdBy: {
    type: GraphQLID,
  },

  replyingTo: {
    type: GraphQLID,
  },
  attachment: {
    type: singleFile,
  },
}
