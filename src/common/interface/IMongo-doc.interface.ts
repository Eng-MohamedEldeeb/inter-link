import { MongoId } from '../types/db'

export interface IMongoDoc {
  _id: MongoId
  createdAt: Date
  updatedAt: Date
  __v: number
}
