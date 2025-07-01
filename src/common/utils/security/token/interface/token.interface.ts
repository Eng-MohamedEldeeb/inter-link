import { JwtPayload, SignOptions } from 'jsonwebtoken'
import { MongoObjId } from '../../../../types/mongo.types'

export interface IPayload extends JwtPayload {
  _id: MongoObjId
}

export interface IJwtArgs {
  payload: {
    _id: MongoObjId
  }
  secretKey?: string
  options?: SignOptions
}
