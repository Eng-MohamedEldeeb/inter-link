import { GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql"
import { argsType } from "../../../../../common/decorators/resolver/returned-type.decorator"
import { userFields } from "../../../../../common/types/graphql/graphql-fields.types"
import { IGetAll } from "../../../post/dto/post.dto"

import {
  IChangeEmail,
  IConfirmDelete,
  IConfirmNewEmail,
  IDeleteAccount,
  IUpdateProfile,
} from "../../dto/profile.dto"

class ProfileArgs {
  readonly getAllSavedPosts = argsType<IGetAll>({
    page: { type: GraphQLInt },
    limit: { type: GraphQLInt },
  })

  readonly updateProfile = argsType<IUpdateProfile>({
    username: { type: userFields.username },
    bio: { type: userFields.bio },
    birthDate: { type: userFields.birthDate },
    phone: { type: userFields.phone },
  })

  readonly changeEmail = argsType<IChangeEmail>({
    originalEmail: { type: new GraphQLNonNull(userFields.email) },
    newEmail: { type: new GraphQLNonNull(userFields.email) },
    password: { type: new GraphQLNonNull(userFields.password) },
  })

  readonly confirmNewEmail = argsType<IConfirmNewEmail>({
    originalEmail: { type: new GraphQLNonNull(userFields.email) },
    otpCode: { type: new GraphQLNonNull(GraphQLString) },
  })

  readonly deactivateAccount = argsType<IDeleteAccount>({
    email: { type: new GraphQLNonNull(userFields.email) },
    password: { type: new GraphQLNonNull(userFields.password) },
  })

  readonly deleteAccount = argsType<IDeleteAccount>({
    email: { type: new GraphQLNonNull(userFields.email) },
    password: { type: new GraphQLNonNull(userFields.password) },
  })

  readonly confirmDeletion = argsType<IConfirmDelete>({
    email: { type: new GraphQLNonNull(userFields.email) },
    otpCode: { type: new GraphQLNonNull(GraphQLString) },
  })
}
export default new ProfileArgs()
