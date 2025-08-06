import { returnedType } from '../../../../common/decorators/resolver/returned-type.decorator'

import { communityFields } from './community-fields.type'

import { ICommunity } from '../../../../db/interfaces/ICommunity.interface'

export const singleCommunity = returnedType<Omit<ICommunity, '__v'>>({
  name: 'singleCommunity',
  fields: communityFields,
})
export class CommunityResponse {
  public static readonly getCommunity = () => {
    return returnedType<Omit<ICommunity, '__v'>>({
      name: 'getCommunityResponse',
      fields: communityFields,
    })
  }
}
