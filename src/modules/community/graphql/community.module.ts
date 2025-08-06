import { returnedType } from '../../../common/decorators/resolver/returned-type.decorator'
import { CommunityController } from './community.controller'

export const queryModule = (() => {
  return {
    type: returnedType({
      name: 'communityQuery',
      fields: {
        getCommunity: CommunityController.getCommunity(),
      },
    }),
    resolve: () => true,
  }
})()

export const mutationModule = (() => {
  return {
    type: returnedType({
      name: 'communityMutation',
      fields: {
        addAdmin: CommunityController.addAdmin(),
        removeAdmin: CommunityController.removeAdmin(),
        edit: CommunityController.edit(),
        changeVisibility: CommunityController.changeVisibility(),
        deleteCommunity: CommunityController.deleteCommunity(),
        removePostFromCommunity: CommunityController.removePostFromCommunity(),
      },
    }),
    resolve: () => true,
  }
})()
