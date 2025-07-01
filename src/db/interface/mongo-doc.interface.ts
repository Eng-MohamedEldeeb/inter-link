import { Types } from 'mongoose'
import { MongoObjId } from '../../common/types/mongo.types'

export interface IMongoDoc {
  _id: MongoObjId
  createdAt: Date
  updatedAt: Date
  __v: number
}

export interface IMongoUpdatedDoc {
  acknowledged: boolean
  modifiedCount: number
  upsertedId: any | null
  upsertedCount: number
  matchedCount: number
}
