import { GraphQLID, GraphQLInt, GraphQLList, GraphQLString } from "graphql"

import {
  DateType,
  ObjFields,
} from "../../../../../common/types/graphql/graphql.types"

import { IComment } from "../../../../../db/interfaces/IComment.interface"
import { multiFiles } from "../../../../../common/services/upload/interface/cloud-response.interface"

export const commentFields: ObjFields<Omit<IComment, "__v">> = {
  _id: { type: GraphQLID },
  createdAt: { type: DateType },
  updatedAt: { type: DateType },

  body: {
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
    type: multiFiles,
  },
}
