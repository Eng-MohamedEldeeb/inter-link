import { IMongoDoc } from './IMongo-doc.interface'
import { MongoId } from '../../common/types/db/db.types'

export interface IGroupInputs {
  name: string
  cover: Object
  createdBy: MongoId
}

export interface IGroup extends IMongoDoc, IGroupInputs {
  posts: MongoId[]
  followers: MongoId[]
  admins: MongoId[]
}
