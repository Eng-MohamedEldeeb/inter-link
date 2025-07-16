import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql'
import { argsType } from '../../../../common/decorators/resolver/returned-type.decorator'
import { userFields } from '../../../../common/types/graphql/graphql-fields.types'
import { IGetAll } from '../../../post/dto/post.dto'

import {
  IChangeEmail,
  IConfirmDelete,
  IConfirmNewEmail,
  IDeleteAccount,
  IUpdateProfile,
} from '../../dto/profile.dto'

export const getAllSavedPosts = argsType<IGetAll>({
  page: { type: GraphQLInt },
  limit: { type: GraphQLInt },
})

export const updateProfile = argsType<IUpdateProfile>({
  username: { type: userFields.username },
  fullName: { type: userFields.fullName },
  bio: { type: userFields.bio },
  birthDate: { type: userFields.birthDate },
  phone: { type: userFields.phone },
})

export const changeEmail = argsType<IChangeEmail>({
  originalEmail: { type: new GraphQLNonNull(userFields.email) },
  newEmail: { type: new GraphQLNonNull(userFields.email) },
  password: { type: new GraphQLNonNull(userFields.password) },
})

export const confirmNewEmail = argsType<IConfirmNewEmail>({
  originalEmail: { type: new GraphQLNonNull(userFields.email) },
  otpCode: { type: new GraphQLNonNull(GraphQLString) },
})

export const deactivateAccount = argsType<IDeleteAccount>({
  email: { type: new GraphQLNonNull(userFields.email) },
  password: { type: new GraphQLNonNull(userFields.password) },
})

export const deleteAccount = argsType<IDeleteAccount>({
  email: { type: new GraphQLNonNull(userFields.email) },
  password: { type: new GraphQLNonNull(userFields.password) },
})

export const confirmDeletion = argsType<IConfirmDelete>({
  email: { type: new GraphQLNonNull(userFields.email) },
  otpCode: { type: new GraphQLNonNull(GraphQLString) },
})
