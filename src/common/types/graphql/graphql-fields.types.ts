import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import { IUser } from '../../../db/interface/IUser.interface'
import { singleFileResponse } from '../../services/upload/interface/cloud-response.interface'
import { DateType, ObjFields } from './graphql.types'
import { IMongoDoc } from '../../../db/interface/IMongo-doc.interface'

const mongoDoc: ObjFields<Omit<IMongoDoc, '__v'>> = {
  _id: { type: GraphQLID },
  createdAt: { type: DateType },
  updatedAt: { type: DateType },
}

const viewer = new GraphQLObjectType({
  name: 'viewerType',
  fields: {
    viewer: { type: GraphQLID },
    totalVisits: { type: GraphQLInt },
  },
})

export const userFields = {
  ...mongoDoc,
  avatar: singleFileResponse,
  fullName: GraphQLString,
  username: GraphQLString,
  email: GraphQLString,
  password: GraphQLString,
  birthDate: DateType,
  phone: GraphQLString,
  bio: GraphQLString,
  isPrivateProfile: GraphQLBoolean,
  age: GraphQLInt,
  totalPosts: GraphQLInt,
  totalFollowers: GraphQLInt,
  totalFollowing: GraphQLInt,
  posts: new GraphQLList(GraphQLID),
  savedPosts: new GraphQLList(GraphQLID),
  likedPosts: new GraphQLList(GraphQLID),
  following: new GraphQLList(GraphQLID),
  followers: new GraphQLList(GraphQLID),
  joinedGroups: new GraphQLList(GraphQLID),
  blockedUsers: new GraphQLList(GraphQLID),
  oldPasswords: new GraphQLList(GraphQLString),
  changedCredentialsAt: DateType,
}

export const profileFields: ObjFields<
  Omit<
    IUser,
    'deactivatedAt' | 'tempEmail' | '__v' | 'password' | 'oldPasswords'
  >
> = {
  ...mongoDoc,

  viewers: { type: new GraphQLList(viewer) },

  fullName: {
    type: userFields.fullName,
  },

  username: {
    type: userFields.username,
  },
  email: {
    type: userFields.email,
  },

  avatar: {
    type: userFields.avatar,
  },
  age: {
    type: userFields.age,
  },

  posts: {
    type: userFields.posts,
  },
  totalPosts: {
    type: userFields.totalPosts,
  },
  savedPosts: {
    type: userFields.savedPosts,
  },
  likedPosts: {
    type: userFields.likedPosts,
  },
  following: {
    type: userFields.following,
  },
  totalFollowing: {
    type: userFields.totalFollowing,
  },
  followers: {
    type: userFields.followers,
  },
  totalFollowers: {
    type: userFields.totalFollowers,
  },
  joinedGroups: {
    type: userFields.joinedGroups,
  },
  blockedUsers: {
    type: userFields.blockedUsers,
  },

  isPrivateProfile: { type: userFields.isPrivateProfile },
}

export const userProfileFields = profileFields
