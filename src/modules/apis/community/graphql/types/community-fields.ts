import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql"
import {
  DateType,
  ObjFields,
} from "../../../../../common/types/graphql/graphql.types"

import { singleFile } from "../../../../../common/services/upload/interface/cloud-response.interface"
import { ICommunity } from "../../../../../db/interfaces/ICommunity.interface"
import { singlePost } from "../../../post/graphql/types/post-response"

export const communityFields: ObjFields<Omit<ICommunity, "__v">> = {
  _id: { type: GraphQLID },
  createdAt: { type: DateType },
  updatedAt: { type: DateType },
  cover: {
    type: singleFile,
  },
  name: { type: GraphQLString },
  slug: { type: GraphQLString },
  description: { type: GraphQLString },
  admins: { type: new GraphQLList(GraphQLID) },
  members: { type: new GraphQLList(GraphQLID) },
  requests: { type: new GraphQLList(GraphQLID) },
  totalMembers: { type: GraphQLInt },
  posts: { type: new GraphQLList(singlePost) },
  isPrivateCommunity: { type: GraphQLBoolean },
  createdBy: { type: GraphQLString },
}

export const oneCommunity = new GraphQLObjectType({
  name: "oneCommunity",
  fields: communityFields,
})
