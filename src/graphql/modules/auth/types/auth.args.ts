import {
  GraphQLFieldConfigArgumentMap,
  GraphQLNonNull,
  GraphQLScalarType,
  GraphQLString,
} from 'graphql'

export const confirmEmailArgs = (): GraphQLFieldConfigArgumentMap => {
  return {
    email: { type: new GraphQLNonNull(GraphQLString) },
  }
}

export const registerArgs = (): GraphQLFieldConfigArgumentMap => {
  return {
    fullName: { type: new GraphQLNonNull(GraphQLString) },
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    confirmPassword: { type: new GraphQLNonNull(GraphQLString) },
    phone: { type: new GraphQLNonNull(GraphQLString) },
    birthDate: {
      type: new GraphQLNonNull(
        new GraphQLScalarType({
          name: 'registerDateArgs',
          parseValue(value) {
            return new Date(value as string)
          },
          serialize(value) {
            const v = value as number
            return new Date(v).toISOString()
          },
        }),
      ),
    },
    otpCode: { type: new GraphQLNonNull(GraphQLString) },
  }
}

export const loginArgs = (): GraphQLFieldConfigArgumentMap => {
  return {
    username: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  }
}

export const forgotPasswordArgs = (): GraphQLFieldConfigArgumentMap => {
  return {
    email: { type: new GraphQLNonNull(GraphQLString) },
  }
}
export const resetPasswordArgs = (): GraphQLFieldConfigArgumentMap => {
  return {
    email: { type: new GraphQLNonNull(GraphQLString) },
    newPassword: { type: new GraphQLNonNull(GraphQLString) },
    confirmPassword: { type: new GraphQLNonNull(GraphQLString) },
    otpCode: { type: new GraphQLNonNull(GraphQLString) },
  }
}
