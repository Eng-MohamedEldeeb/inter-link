import { AuthController } from './auth.controller'

export const authMutationFields = () => {
  return {
    confirmEmail: AuthController.confirmEmail(),
    register: AuthController.register(),
    login: AuthController.login(),
    // forgotPassword: AuthController.forgotPassword(),
    // resetPassword: AuthController.resetPassword(),
  }
}
