import { GraphQLNonNull, GraphQLString } from 'graphql'
import { argsType } from '../../../../common/decorators/graphql/returned-type.decorator'
import { userFields } from '../../../../common/types/graphql/graphql-fields.types'
import {
  IChangeEmailDTO,
  IConfirmDeleteDTO,
  IConfirmNewEmailDTO,
  IDeleteAccountDTO,
  IUpdateProfileDTO,
} from '../../dto/profile.dto'

export const updateProfile = argsType<IUpdateProfileDTO>({
  username: { type: new GraphQLNonNull(userFields.username) },
  fullName: { type: new GraphQLNonNull(userFields.fullName) },
  bio: { type: new GraphQLNonNull(userFields.bio) },
  birthDate: { type: new GraphQLNonNull(userFields.birthDate) },
  phone: { type: new GraphQLNonNull(userFields.phone) },
})

export const changeEmail = argsType<IChangeEmailDTO>({
  originalEmail: { type: new GraphQLNonNull(userFields.email) },
  newEmail: { type: new GraphQLNonNull(userFields.email) },
  password: { type: new GraphQLNonNull(userFields.password) },
})

export const confirmNewEmail = argsType<IConfirmNewEmailDTO>({
  originalEmail: { type: new GraphQLNonNull(userFields.email) },
  otpCode: { type: new GraphQLNonNull(GraphQLString) },
})

export const deactivateAccount = argsType<IDeleteAccountDTO>({
  email: { type: new GraphQLNonNull(userFields.email) },
  password: { type: new GraphQLNonNull(userFields.password) },
})

export const deleteAccount = argsType<IDeleteAccountDTO>({
  email: { type: new GraphQLNonNull(userFields.email) },
  password: { type: new GraphQLNonNull(userFields.password) },
})

export const confirmDeletion = argsType<IConfirmDeleteDTO>({
  email: { type: new GraphQLNonNull(userFields.email) },
  otpCode: { type: new GraphQLNonNull(GraphQLString) },
})
