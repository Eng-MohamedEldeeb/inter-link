import { GraphQLID, GraphQLNonNull } from 'graphql'

import { argsType } from '../../../../common/decorators/resolver/returned-type.decorator'
import { IBlockUser } from '../../dto/user.dto'

export const getUserProfile = argsType<IBlockUser>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})

export const getUserFollowers = getUserProfile

export const getUserFollowing = getUserProfile

export const blockUser = argsType<IBlockUser>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})

export const unblockUser = blockUser
