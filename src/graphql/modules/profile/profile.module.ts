import { ProfileController } from './profile.controller'

export const profileQueryFields = () => {
  return {
    getProfile: ProfileController.getProfile(),
  }
}
