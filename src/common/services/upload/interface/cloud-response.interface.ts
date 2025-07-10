import { GraphQLObjectType, GraphQLString } from 'graphql'

export interface ICloud {
  public_id: string
  secure_url: string
}

export interface ICloudFile {
  fullPath: string
  folderId: string
  path: ICloud
}
export interface ICloudFiles {
  fullPath: string
  folderId: string
  paths: ICloud[]
}

export const singleFile = new GraphQLObjectType({
  name: 'singleFile',
  fields: {
    secure_url: { type: GraphQLString },
  },
})
