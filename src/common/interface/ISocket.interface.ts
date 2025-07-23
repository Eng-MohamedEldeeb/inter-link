import { Socket } from 'socket.io'

import { IPayload } from '../utils/security/token/interface/token.interface'
import { IUser } from '../../db/interface/IUser.interface'

export interface ISocket extends Socket {
  tokenPayload: IPayload
  profile: IUser
}
