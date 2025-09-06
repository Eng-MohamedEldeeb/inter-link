import { GraphQLNonNull, GraphQLString } from "graphql"

import * as DTO from "../../dto/auth.dto"

import { argsType } from "../../../../common/decorators/resolver/returned-type.decorator"
import { userFields } from "../../../../common/types/graphql/graphql-fields.types"

class AuthArgs {
  readonly confirmEmail = argsType<DTO.IConfirmEmail>({
    email: { type: new GraphQLNonNull(userFields.email) },
  })

  readonly register = argsType<DTO.IRegister>({
    otpCode: {
      type: new GraphQLNonNull(GraphQLString),
    },
    username: { type: new GraphQLNonNull(userFields.username) },
    email: { type: new GraphQLNonNull(userFields.email) },
    password: { type: new GraphQLNonNull(userFields.password) },
    confirmPassword: { type: new GraphQLNonNull(userFields.password) },
    birthDate: { type: new GraphQLNonNull(userFields.birthDate) },
    phone: { type: new GraphQLNonNull(userFields.phone) },
    bio: { type: userFields.bio },
  })

  readonly login = argsType<DTO.ILogin>({
    username: { type: new GraphQLNonNull(userFields.email) },
    password: { type: new GraphQLNonNull(userFields.password) },
  })

  readonly forgotPassword = argsType<DTO.IForgotPassword>({
    email: { type: new GraphQLNonNull(userFields.email) },
  })

  readonly resetPassword = argsType<DTO.IResetPassword>({
    email: { type: new GraphQLNonNull(userFields.email) },
    newPassword: { type: new GraphQLNonNull(userFields.password) },
    confirmPassword: { type: new GraphQLNonNull(userFields.password) },
    otpCode: { type: new GraphQLNonNull(GraphQLString) },
  })
}

export default new AuthArgs()
