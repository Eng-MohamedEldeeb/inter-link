import { GraphQLNonNull, GraphQLString } from 'graphql'

import * as DTO from '../../dto/auth.dto'

import { argsType } from '../../../../common/decorators/resolver/returned-type.decorator'
import { userFields } from '../../../../common/types/graphql/graphql-fields.types'

export const confirmEmail = argsType<DTO.IConfirmEmail>({
  email: { type: new GraphQLNonNull(userFields.email) },
})

export const register = argsType<DTO.IRegister>({
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

export const login = argsType<DTO.ILogin>({
  username: { type: new GraphQLNonNull(userFields.email) },
  password: { type: new GraphQLNonNull(userFields.password) },
})

export const forgotPassword = argsType<DTO.IForgotPassword>({
  email: { type: new GraphQLNonNull(userFields.email) },
})

export const resetPassword = argsType<DTO.IResetPassword>({
  email: { type: new GraphQLNonNull(userFields.email) },
  newPassword: { type: new GraphQLNonNull(userFields.password) },
  confirmPassword: { type: new GraphQLNonNull(userFields.password) },
  otpCode: { type: new GraphQLNonNull(GraphQLString) },
})
