import { GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql'

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

export const cloudFile = new GraphQLObjectType({
  name: 'cloudFile',
  fields: {
    secure_url: { type: GraphQLString },
  },
})

export const singleFile = new GraphQLObjectType({
  name: 'singleFile',
  fields: {
    path: { type: cloudFile },
  },
})

export const multiFiles = new GraphQLObjectType({
  name: 'multiFiles',
  fields: {
    paths: { type: new GraphQLList(cloudFile) },
  },
})
