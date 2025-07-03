import { MongoObjId } from '../../common/types/db/mongo.types'

export interface IMongoDoc {
  _id: MongoObjId
  createdAt: Date
  updatedAt: Date
  __v: number
}
