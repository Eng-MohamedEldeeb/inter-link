import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import { IUser } from '../../../db/interface/IUser.interface'
import { singleFile } from '../../services/upload/interface/cloud-response.interface'
import { DateType, ObjFields } from './graphql.types'
import { onePost } from '../../../modules/post/graphql/types/post-fields.type'

const viewer = new GraphQLObjectType({
  name: 'viewerType',
  fields: {
    viewer: { type: GraphQLID },
    totalVisits: { type: GraphQLInt },
  },
})

export const userFields = {
  _id: { type: GraphQLID },
  createdAt: { type: DateType },
  updatedAt: { type: DateType },
  avatar: singleFile,
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
  posts: new GraphQLList(onePost),
  savedPosts: new GraphQLList(GraphQLID),
  likedPosts: new GraphQLList(GraphQLID),
  following: new GraphQLList(GraphQLID),
  followers: new GraphQLList(GraphQLID),
  joinedGroups: new GraphQLList(GraphQLID),
  blockedUsers: new GraphQLList(GraphQLID),
  oldPasswords: new GraphQLList(GraphQLString),
  changedCredentialsAt: DateType,
}

export const userProfileFields: ObjFields<
  Omit<
    IUser,
    | 'deactivatedAt'
    | 'tempEmail'
    | '__v'
    | 'password'
    | 'oldPasswords'
    | 'viewers'
  >
> = {
  _id: { type: GraphQLID },
  createdAt: { type: DateType },
  updatedAt: { type: DateType },

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

export const profileFields: ObjFields<
  Omit<
    IUser,
    'deactivatedAt' | 'tempEmail' | '__v' | 'password' | 'oldPasswords'
  >
> = { ...userProfileFields, viewers: { type: new GraphQLList(viewer) } }

export const userProfile = userProfileFields
export const profile = profileFields
