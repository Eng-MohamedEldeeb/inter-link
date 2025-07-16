import { GraphQLID, GraphQLInt, GraphQLList, GraphQLString } from 'graphql'

import { IReply } from '../../../../db/interface/IReply.interface'

import {
  DateType,
  ObjFields,
} from '../../../../common/types/graphql/graphql.types'

export const replyFields: ObjFields<Omit<IReply, '__v'>> = {
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

  createdBy: {
    type: GraphQLID,
  },

  replyingTo: {
    type: GraphQLID,
  },
}
