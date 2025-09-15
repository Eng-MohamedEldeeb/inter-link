import { returnedType } from "../../../../../common/decorators/resolver/returned-type.decorator"
import { userProfileFields } from "../../../../../common/types/graphql/graphql-fields.types"
import { IUser } from "../../../../../db/interfaces/IUser.interface"

export class UserResponse {
  // Query:
  public static readonly getUserProfile = () => {
    return returnedType({
      name: "fullUserProfile",
      fields: userProfileFields,
    })
  }

  public static readonly getUseFollowers = () => {
    return returnedType<Pick<IUser, "followers">>({
      name: "userFollowers",
      fields: {
        followers: userProfileFields.followers,
      },
    })
  }

  public static readonly getUseFollowing = () => {
    return returnedType<Pick<IUser, "following">>({
      name: "userFollowing",
      fields: {
        following: userProfileFields.following,
      },
    })
  }
}
