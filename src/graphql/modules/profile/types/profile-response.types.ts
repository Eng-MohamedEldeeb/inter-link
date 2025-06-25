import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import { oneFileResponse } from '../../../common/types/graphQL.types'

export const oneProfileResponse = new GraphQLObjectType({
  name: 'oneUserResponse',
  fields: {
    avatar: { type: oneFileResponse },
    fullName: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    bio: { type: GraphQLString },
    isPrivateProfile: { type: GraphQLBoolean },
    age: { type: GraphQLInt },
    totalPosts: { type: GraphQLInt },
    totalFollowers: { type: GraphQLInt },
    totalFollowing: { type: GraphQLInt },
    posts: { type: new GraphQLList(GraphQLID) },
    savedPosts: { type: new GraphQLList(GraphQLID) },
    likedPosts: { type: new GraphQLList(GraphQLID) },
    following: { type: new GraphQLList(GraphQLID) },
    followers: { type: new GraphQLList(GraphQLID) },
    joinedGroups: { type: new GraphQLList(GraphQLID) },
    blockList: { type: new GraphQLList(GraphQLID) },
  },
})
