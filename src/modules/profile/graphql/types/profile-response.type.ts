import { GraphQLInt, GraphQLList } from 'graphql'
import { returnedType } from '../../../../common/decorators/resolver/returned-type.decorator'
import { IPost } from '../../../../db/interfaces/IPost.interface'
import { IUser } from '../../../../db/interfaces/IUser.interface'
import { IUpdateProfile } from '../../dto/profile.dto'
import { singlePost } from '../../../post/graphql/types/post-response.type'

import * as graphQlFields from '../../../../common/types/graphql/graphql-fields.types'

export class ProfileResponse {
  // Query:
  public static readonly getProfile = () => {
    return returnedType<
      Omit<
        IUser,
        'deactivatedAt' | 'tempEmail' | '__v' | 'password' | 'oldPasswords'
      >
    >({
      name: 'fullProfile',
      fields: graphQlFields.profileFields,
    })
  }

  public static readonly getFollowers = () => {
    return returnedType<Pick<IUser, 'followers'>>({
      name: 'profileFollowers',
      fields: {
        followers: graphQlFields.profileFields.followers,
      },
    })
  }

  public static readonly getFollowing = () => {
    return returnedType<Pick<IUser, 'following'>>({
      name: 'profileFollowing',
      fields: {
        following: graphQlFields.profileFields.following,
      },
    })
  }

  public static readonly getAllSavedPosts = () => {
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
  public static readonly updateProfileResponse = () => {
    return returnedType<IUpdateProfile>({
      name: 'updatedData',
      fields: {
        username: { type: graphQlFields.userFields.username },
        fullName: { type: graphQlFields.userFields.fullName },
        bio: { type: graphQlFields.userFields.bio },
        birthDate: { type: graphQlFields.userFields.birthDate },
        phone: { type: graphQlFields.userFields.phone },
      },
    })
  }
}
