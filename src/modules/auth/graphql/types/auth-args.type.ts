import { GraphQLNonNull, GraphQLString } from 'graphql'
import { argsType } from '../../../../common/decorators/resolver/returned-type.decorator'
import { userFields } from '../../../../common/types/graphql/graphql-fields.types'
import {
  IConfirmEmailDTO,
  IForgotPasswordDTO,
  ILoginDTO,
  IRegisterDTO,
  IResetPasswordDTO,
} from '../../dto/auth.dto'

export const confirmEmail = argsType<IConfirmEmailDTO>({
  email: { type: new GraphQLNonNull(userFields.email) },
})

export const register = argsType<IRegisterDTO>({
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

export const login = argsType<ILoginDTO>({
  username: { type: new GraphQLNonNull(userFields.email) },
  password: { type: new GraphQLNonNull(userFields.password) },
})

export const forgotPassword = argsType<IForgotPasswordDTO>({
  email: { type: new GraphQLNonNull(userFields.email) },
})

export const resetPassword = argsType<IResetPasswordDTO>({
  email: { type: new GraphQLNonNull(userFields.email) },
  newPassword: { type: new GraphQLNonNull(userFields.password) },
  confirmPassword: { type: new GraphQLNonNull(userFields.password) },
  otpCode: { type: new GraphQLNonNull(GraphQLString) },
})
