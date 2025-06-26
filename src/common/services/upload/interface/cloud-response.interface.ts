export interface ICloud {
  public_id: string
  secure_url: string
}

export interface ICloudFile {
  folderId?: string
  path: ICloud
}
export interface ICloudFiles {
  folderId?: string
  paths: ICloud[]
}
