import { GraphQLNonNull, GraphQLString } from 'graphql'
import { argsType } from '../../../../common/decorators/resolver/returned-type.decorator'
import { userFields } from '../../../../common/types/graphql/graphql-fields.types'
import {
  IConfirmEmail,
  IForgotPassword,
  ILogin,
  IRegister,
  IResetPassword,
} from '../../dto/auth.dto'

export const confirmEmail = argsType<IConfirmEmail>({
  email: { type: new GraphQLNonNull(userFields.email) },
})

export const register = argsType<IRegister>({
  fullName: { type: new GraphQLNonNull(userFields.fullName) },
  username: { type: new GraphQLNonNull(userFields.username) },
  email: { type: new GraphQLNonNull(userFields.email) },
  password: { type: new GraphQLNonNull(userFields.password) },
  confirmPassword: { type: new GraphQLNonNull(userFields.password) },
  birthDate: { type: new GraphQLNonNull(userFields.birthDate) },
  bio: { type: new GraphQLNonNull(userFields.bio) },
  phone: { type: new GraphQLNonNull(userFields.phone) },
  otpCode: {
    type: new GraphQLNonNull(GraphQLString),
  },
})

export const login = argsType<ILogin>({
  username: { type: new GraphQLNonNull(userFields.email) },
  password: { type: new GraphQLNonNull(userFields.password) },
})

export const forgotPassword = argsType<IForgotPassword>({
  email: { type: new GraphQLNonNull(userFields.email) },
})

export const resetPassword = argsType<IResetPassword>({
  email: { type: new GraphQLNonNull(userFields.email) },
  newPassword: { type: new GraphQLNonNull(userFields.password) },
  confirmPassword: { type: new GraphQLNonNull(userFields.password) },
  otpCode: { type: new GraphQLNonNull(GraphQLString) },
})
