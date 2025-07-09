import { returnedType } from '../../../../common/decorators/graphql/returned-type.decorator'
import {
  profileFields,
  userFields,
} from '../../../../common/types/graphql/graphql-fields.types'
import { IUser } from '../../../../db/interface/IUser.interface'
import { IUpdateProfileDTO } from '../../dto/profile.dto'

export class ProfileResponse {
  // Query:
  static readonly getProfile = () => {
    return returnedType<
      Omit<
        IUser,
        'deactivatedAt' | 'tempEmail' | '__v' | 'password' | 'oldPasswords'
      >
    >({
      name: 'fullProfile',
      fields: profileFields,
    })
  }

  static readonly getFollowers = () => {
    return returnedType<Pick<IUser, 'followers'>>({
      name: 'profileFollowers',
      fields: {
        followers: profileFields.followers,
      },
    })
  }

  static readonly getFollowing = () => {
    return returnedType<Pick<IUser, 'following'>>({
      name: 'profileFollowing',
      fields: {
        following: profileFields.following,
      },
    })
  }

  // Mutation:
  static readonly updateProfileResponse = () => {
    return returnedType<IUpdateProfileDTO>({
      name: 'updatedData',
      fields: {
        username: { type: userFields.username },
        fullName: { type: userFields.fullName },
        bio: { type: userFields.bio },
        birthDate: { type: userFields.birthDate },
        phone: { type: userFields.phone },
      },
    })
  }
}
