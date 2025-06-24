import { UserController } from './user.controller'

export const userQueryFields = () => {
  return {
    getProfile: UserController.getProfile(),
  }
}
