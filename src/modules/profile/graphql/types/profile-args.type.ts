import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql'
import { argsType } from '../../../../common/decorators/graphql/returned-type.decorator'
import { userFields } from '../../../../common/types/graphql/graphql-fields.types'
import {
  IChangeEmailDTO,
  IConfirmDeleteDTO,
  IConfirmNewEmailDTO,
  IDeleteAccountDTO,
  IUpdateProfileDTO,
} from '../../dto/profile.dto'
import { IGetAllDTO } from '../../../post/dto/post.dto'

export const getAllSavedPosts = argsType<IGetAllDTO>({
  page: { type: GraphQLInt },
  limit: { type: GraphQLInt },
})

export const updateProfile = argsType<IUpdateProfileDTO>({
  username: { type: userFields.username },
  fullName: { type: userFields.fullName },
  bio: { type: userFields.bio },
  birthDate: { type: userFields.birthDate },
  phone: { type: userFields.phone },
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
