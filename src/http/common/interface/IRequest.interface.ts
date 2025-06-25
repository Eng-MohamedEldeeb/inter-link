import { Request } from 'express'
import { IPayload } from '../../../common/utils/security/token/interface/token.interface'
import { IUser } from '../../../db/models/interfaces/IUser.interface'
import {
  ICloudFile,
  ICloudFiles,
} from '../services/upload/interface/cloud-response.interface'

export interface IRequest<P = any, Q = any> extends Request<P, any, any, Q> {
  tokenPayload: IPayload
  profile: IUser
  user: IUser
  cloudFile: ICloudFile
  cloudFiles: ICloudFiles
}
