import authController from "./auth.controller"
import { returnedType } from "../../../../common/decorators/resolver/returned-type.decorator"

export const mutationModule = (() => {
  return {
    type: returnedType({
      name: "authMutation",
      fields: {
        confirmEmail: authController.confirmEmail(),
        register: authController.register(),
        login: authController.login(),
        forgotPassword: authController.forgotPassword(),
        resetPassword: authController.resetPassword(),
      },
    }),
    resolve: () => true,
  }
})()
