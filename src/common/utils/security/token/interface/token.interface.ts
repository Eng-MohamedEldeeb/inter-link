import { JwtPayload, SignOptions } from 'jsonwebtoken'

import { MongoId } from '../../../../types/db/db.types'

export interface IPayload extends JwtPayload {
  _id: MongoId
}

export interface IJwtArgs {
  payload: {
    _id: MongoId
  }
  secretKey?: string
  options?: SignOptions
}
