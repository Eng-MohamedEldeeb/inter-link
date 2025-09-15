import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from "graphql"

import { argsType } from "../../../../../common/decorators/resolver/returned-type.decorator"
import { IBlockUser } from "../../dto/user.dto"

export class UserArgs {
  public static readonly getUserProfile = argsType({
    search: {
      type: new GraphQLNonNull(
        new GraphQLInputObjectType({
          name: "userQuerySearch",
          fields: {
            username: { type: GraphQLString },
            user_id: { type: GraphQLID },
          },
        }),
      ),
    },
  })

  public static readonly getUserFollowers = this.getUserProfile

  public static readonly getUserFollowing = this.getUserProfile

  public static readonly blockUser = argsType<IBlockUser>({
    user_id: { type: new GraphQLNonNull(GraphQLID) },
  })

  public static readonly unblockUser = this.blockUser
}
