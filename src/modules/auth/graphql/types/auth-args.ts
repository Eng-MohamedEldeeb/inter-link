import { GraphQLNonNull, GraphQLString } from "graphql"

import * as DTO from "../../dto/auth.dto"

import { argsType } from "../../../../common/decorators/resolver/returned-type.decorator"
import { userFields } from "../../../../common/types/graphql/graphql-fields.types"

export class AuthArgs {
  public static readonly confirmEmail = argsType<DTO.IConfirmEmail>({
    email: { type: new GraphQLNonNull(userFields.email) },
  })

  public static readonly register = argsType<DTO.IRegister>({
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

  public static readonly login = argsType<DTO.ILogin>({
    username: { type: new GraphQLNonNull(userFields.email) },
    password: { type: new GraphQLNonNull(userFields.password) },
  })

  public static readonly forgotPassword = argsType<DTO.IForgotPassword>({
    email: { type: new GraphQLNonNull(userFields.email) },
  })

  public static readonly resetPassword = argsType<DTO.IResetPassword>({
    email: { type: new GraphQLNonNull(userFields.email) },
    newPassword: { type: new GraphQLNonNull(userFields.password) },
    confirmPassword: { type: new GraphQLNonNull(userFields.password) },
    otpCode: { type: new GraphQLNonNull(GraphQLString) },
  })
}
