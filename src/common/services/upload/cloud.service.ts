import { UploadApiResponse } from 'cloudinary'

import Cloudinary from './config/cloud-config'

export class CloudUploader {
  private static readonly cloud: typeof Cloudinary = Cloudinary

  static readonly upload = async ({
    path,
    folderName,
    public_id,
  }: {
    path: string
    folderName?: string
    public_id?: string
  }): Promise<UploadApiResponse> => {
    if (public_id) return await this.cloud.uploader.upload(path, { public_id })

    return await this.cloud.uploader.upload(path, { folder: folderName })
  }

  static readonly delete = async (
    public_id: string,
  ): Promise<UploadApiResponse> => {
    return await this.cloud.uploader.destroy(public_id)
  }

  static readonly deleteFolder = async (
    folderId: string,
  ): Promise<UploadApiResponse> => {
    return await this.cloud.api.delete_folder(folderId)
  }
}
