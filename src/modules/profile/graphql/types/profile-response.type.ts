import { GraphQLInt, GraphQLList } from 'graphql'
import { returnedType } from '../../../../common/decorators/resolver/returned-type.decorator'
import {
  profileFields,
  userFields,
} from '../../../../common/types/graphql/graphql-fields.types'
import { IPost } from '../../../../db/interface/IPost.interface'
import { IUser } from '../../../../db/interface/IUser.interface'
import { IUpdateProfile } from '../../dto/profile.dto'
import { singlePost } from '../../../post/graphql/types/post-response.type'

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

  static readonly getAllSavedPosts = () => {
    return returnedType<{ posts: IPost[]; count: number; page: number }>({
      name: 'getAllSavedPostsResponse',
      fields: {
        posts: {
          type: new GraphQLList(singlePost),
        },
        page: { type: GraphQLInt },
        count: { type: GraphQLInt },
      },
    })
  }

  // Mutation:
  static readonly updateProfileResponse = () => {
    return returnedType<IUpdateProfile>({
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
