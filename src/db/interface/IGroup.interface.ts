import { IMongoDoc } from './IMongo-doc.interface'
import { MongoObjId } from '../../common/types/db/mongo.types'

export interface IGroupInputs {
  name: string
  cover: Object
  createdBy: MongoObjId
}

export interface IGroup extends IMongoDoc, IGroupInputs {
  posts: MongoObjId[]
  followers: MongoObjId[]
  admins: MongoObjId[]
}
