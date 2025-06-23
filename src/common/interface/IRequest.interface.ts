import { Request } from 'express'
import { IUser } from '../../db/models/interfaces/IUser.interface'
// import { ICloudFiles } from ''
import { IPayload } from '../../utils/security/token/interface/token.interface'

export interface IRequest<P = any, Q = any> extends Request<P, any, any, Q> {
  tokenPayload: IPayload
  user: IUser
  cloudFiles: { paths: [] }
}
