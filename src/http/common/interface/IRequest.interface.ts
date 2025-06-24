import { Request } from 'express'
import { IPayload } from '../../../common/utils/security/token/interface/token.interface'
import { IUser } from '../../../db/models/interfaces/IUser.interface'
import { ICloudFiles } from '../services/upload/interface/cloud-response.interface'

export interface IRequest<P = any, Q = any> extends Request<P, any, any, Q> {
  tokenPayload: IPayload
  user: IUser
  cloudFiles: ICloudFiles
}
