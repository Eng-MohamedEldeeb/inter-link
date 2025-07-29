import { JwtPayload, SignOptions } from 'jsonwebtoken'

import { MongoId } from '../../../../types/db'

export interface IPayload extends Required<JwtPayload> {
  _id: MongoId
}

export interface IJwtArgs {
  payload: {
    _id: MongoId
  }
  secretKey?: string
  options?: SignOptions
}
