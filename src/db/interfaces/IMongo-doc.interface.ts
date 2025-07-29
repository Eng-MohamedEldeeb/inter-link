import { MongoId } from '../../common/types/db'

export interface IMongoDoc {
  _id: MongoId
  createdAt: Date
  updatedAt: Date
  __v: number
}
