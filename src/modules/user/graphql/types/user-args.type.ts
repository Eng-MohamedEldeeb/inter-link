import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'

import { argsType } from '../../../../common/decorators/resolver/returned-type.decorator'
import { IBlockUser } from '../../dto/user.dto'

export const getUserProfile = argsType({
  search: {
    type: new GraphQLNonNull(
      new GraphQLInputObjectType({
        name: 'userQuerySearch',
        fields: {
          username: { type: GraphQLString },
          id: { type: GraphQLID },
        },
      }),
    ),
  },
})

export const getUserFollowers = getUserProfile

export const getUserFollowing = getUserProfile

export const blockUser = argsType<IBlockUser>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})

export const unblockUser = blockUser
