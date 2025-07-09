import { returnedType } from '../../../../common/decorators/graphql/returned-type.decorator'
import { userProfileFields } from '../../../../common/types/graphql/graphql-fields.types'
import { IUser } from '../../../../db/interface/IUser.interface'

export class UserResponse {
  // Query:
  static readonly getUserProfile = () => {
    return returnedType({
      name: 'fullUserProfile',
      fields: userProfileFields,
    })
  }

  static readonly getUseFollowers = () => {
    return returnedType<Pick<IUser, 'followers'>>({
      name: 'userFollowers',
      fields: {
        followers: userProfileFields.followers,
      },
    })
  }

  static readonly getUseFollowing = () => {
    return returnedType<Pick<IUser, 'following'>>({
      name: 'userFollowing',
      fields: {
        following: userProfileFields.following,
      },
    })
  }

  // Mutation:
  // static readonly updateProfileResponse = () => {
  //   return returnedType<IUpdateProfileDTO>({
  //     name: 'updatedData',
  //     fields: {
  //       username: { type: userFields.username },
  //       fullName: { type: userFields.fullName },
  //       bio: { type: userFields.bio },
  //       birthDate: { type: userFields.birthDate },
  //       phone: { type: userFields.phone },
  //     },
  //   })
  // }
}
