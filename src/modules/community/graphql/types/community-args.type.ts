import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'

import { argsType } from '../../../../common/decorators/resolver/returned-type.decorator'

import * as DTO from '../../dto/community.dto'

export const getCommunity = argsType<DTO.IGetCommunity>({
  communityId: { type: new GraphQLNonNull(GraphQLID) },
})

export const create = argsType<
  Omit<DTO.ICreateCommunity, 'cover' | 'createdBy'>
>({
  name: { type: new GraphQLNonNull(GraphQLString) },
  description: { type: new GraphQLNonNull(GraphQLString) },
  isPrivateCommunity: { type: GraphQLBoolean },
})

export const join = argsType<Pick<DTO.IJoinCommunity, 'communityId'>>({
  communityId: { type: new GraphQLNonNull(GraphQLID) },
})

export const leave = argsType<Pick<DTO.IJoinCommunity, 'communityId'>>({
  communityId: { type: new GraphQLNonNull(GraphQLID) },
})

export const acceptJoinRequest = argsType<DTO.IAcceptJoinRequest>({
  communityId: { type: new GraphQLNonNull(GraphQLID) },
  userId: { type: new GraphQLNonNull(GraphQLID) },
})

export const rejectJoinRequest = argsType<DTO.IRejectJoinRequest>({
  communityId: { type: new GraphQLNonNull(GraphQLID) },
  userId: { type: new GraphQLNonNull(GraphQLID) },
})

export const kickOut = argsType<DTO.IRejectJoinRequest>({
  communityId: { type: new GraphQLNonNull(GraphQLID) },
  userId: { type: new GraphQLNonNull(GraphQLID) },
})

export const edit = argsType<DTO.IEditCommunity>({
  communityId: { type: new GraphQLNonNull(GraphQLID) },
  name: { type: GraphQLString },
  description: { type: GraphQLString },
})

export const addAdmin = argsType<DTO.IAddAdmin>({
  communityId: { type: new GraphQLNonNull(GraphQLID) },
  userId: { type: new GraphQLNonNull(GraphQLID) },
})

export const removeAdmin = argsType<DTO.IRemoveAdmin>({
  communityId: { type: new GraphQLNonNull(GraphQLID) },
  adminId: { type: new GraphQLNonNull(GraphQLID) },
})

export const deleteCommunity = argsType<DTO.IDeleteCommunity>({
  communityId: { type: new GraphQLNonNull(GraphQLID) },
})

export const removePost = argsType<DTO.IRemovePost>({
  communityId: { type: new GraphQLNonNull(GraphQLID) },
  postId: { type: new GraphQLNonNull(GraphQLID) },
})

export const changeVisibility = argsType<DTO.IChangeCommunityVisibility>({
  communityId: { type: new GraphQLNonNull(GraphQLID) },
})
