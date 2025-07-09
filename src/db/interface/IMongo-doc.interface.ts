import { MongoId } from '../../common/types/db/db.types'

export interface IMongoDoc {
  _id: MongoId
  createdAt: Date
  updatedAt: Date
  __v: number
}
