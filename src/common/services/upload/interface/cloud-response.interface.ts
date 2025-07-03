import { GraphQLID, GraphQLObjectType, GraphQLString } from 'graphql'

export interface ICloud {
  public_id: string
  secure_url: string
}

export interface ICloudFile {
  folderId: string
  path: ICloud
}
export interface ICloudFiles {
  folderId: string
  paths: ICloud[]
}

export const singleFileResponse = new GraphQLObjectType({
  name: 'singleFileResponse',
  fields: {
    secure_url: { type: GraphQLString },
  },
})
