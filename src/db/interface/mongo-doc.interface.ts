import { Types } from 'mongoose'

export interface IMongoDoc {
  _id: Types.ObjectId
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
