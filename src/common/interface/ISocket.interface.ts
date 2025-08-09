import { Socket } from 'socket.io'

import { IPayload } from '../utils/security/token/interface/token.interface'
import { IUser } from '../../db/interfaces/IUser.interface'
import { IGroup } from '../../db/interfaces/IGroup.interface'

export interface ISocket extends Socket {
  tokenPayload: IPayload

  profile: IUser
  user: IUser
  group: IGroup
}
