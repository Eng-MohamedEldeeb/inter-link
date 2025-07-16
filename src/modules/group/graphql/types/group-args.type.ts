import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'

import { argsType } from '../../../../common/decorators/resolver/returned-type.decorator'

import * as DTO from '../../dto/group.dto'

export const getGroup = argsType<DTO.IGetGroup>({
  groupId: { type: new GraphQLNonNull(GraphQLID) },
})

export const edit = argsType<DTO.IEditGroup>({
  groupId: { type: new GraphQLNonNull(GraphQLID) },
  name: { type: GraphQLString },
  description: { type: GraphQLString },
  isPrivateGroup: { type: GraphQLBoolean },
})

export const addAdmin = argsType<DTO.IAddAdmin>({
  groupId: { type: new GraphQLNonNull(GraphQLID) },
  userId: { type: new GraphQLNonNull(GraphQLID) },
})

export const removeAdmin = argsType<DTO.IRemoveAdmin>({
  groupId: { type: new GraphQLNonNull(GraphQLID) },
  adminId: { type: new GraphQLNonNull(GraphQLID) },
})

export const deleteGroup = argsType<DTO.IDeleteGroup>({
  groupId: { type: new GraphQLNonNull(GraphQLID) },
})

export const removePost = argsType<DTO.IRemovePost>({
  groupId: { type: new GraphQLNonNull(GraphQLID) },
  postId: { type: new GraphQLNonNull(GraphQLID) },
})
