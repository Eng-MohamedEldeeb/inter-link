import { returnedType } from '../../../../common/decorators/resolver/returned-type.decorator'

import { communityFields } from './community-fields.type'

import { ICommunity } from '../../../../db/interfaces/ICommunity.interface'
import { GraphQLInt, GraphQLList, GraphQLString } from 'graphql'
import {
  ICloud,
  ICloudFile,
} from '../../../../common/services/upload/interface/cloud-response.interface'
import { userProfileFields } from '../../../../common/types/graphql/graphql-fields.types'

export const singleCommunity = returnedType<Omit<ICommunity, '__v'>>({
  name: 'singleCommunity',
  fields: communityFields,
})

export class CommunityResponse {
  public static readonly getAllCommunities = () => {
    return new GraphQLList(
      returnedType<Pick<ICommunity, 'cover' | 'name' | '_id'>>({
        name: 'communitiesResult',
        fields: {
          cover: {
            type: returnedType<Pick<ICloudFile, 'path'>>({
              name: 'communityCover',
              fields: {
                path: {
                  type: returnedType<Pick<ICloud, 'secure_url'>>({
                    name: 'communityCoverPath',
                    fields: {
                      secure_url: { type: GraphQLString },
                    },
                  }),
                },
              },
            }),
          },

          _id: communityFields._id,
          name: communityFields.name,
        },
      }),
    )
  }

  public static readonly getCommunity = () => {
    return returnedType<Omit<ICommunity, '__v'>>({
      name: 'getCommunityResponse',
      fields: communityFields,
    })
  }

  public static readonly getCommunityMembers = () => {
    return returnedType<Pick<ICommunity, 'members' | 'totalMembers' | '_id'>>({
      name: 'communityMembersResult',
      fields: {
        members: {
          type: new GraphQLList(
            returnedType({
              name: 'communityMember',
              fields: userProfileFields,
            }),
          ),
        },

        _id: communityFields._id,
        totalMembers: { type: GraphQLInt },
      },
    })
  }
}
