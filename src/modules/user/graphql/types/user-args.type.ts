import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql'
import { argsType } from '../../../../common/decorators/resolver/returned-type.decorator'
import { IBlockUserDTO } from '../../dto/user.dto'

export const getUserProfile = argsType<IBlockUserDTO>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})

export const getUserFollowers = getUserProfile

export const getUserFollowing = getUserProfile

export const blockUser = argsType<IBlockUserDTO>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})

export const unblockUser = blockUser
