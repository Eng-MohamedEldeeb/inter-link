import { returnedType } from '../../../common/decorators/graphql/returned-type.decorator'
import { AuthController } from './auth.controller'

export const mutationModule = (() => {
  return {
    type: returnedType({
      name: 'authMutation',
      fields: {
        confirmEmail: AuthController.confirmEmail(),
        register: AuthController.register(),
        login: AuthController.login(),
        forgotPassword: AuthController.forgotPassword(),
        resetPassword: AuthController.resetPassword(),
      },
    }),
  }
})()
