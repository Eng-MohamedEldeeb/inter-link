import { Types } from 'mongoose'
import { IMongoDoc } from '../../interface/mongo-doc.interface'

export interface IGroupInputs {
  name: string
  cover: Object
  createdBy: Types.ObjectId
}

export interface IGroup extends IMongoDoc, IGroupInputs {
  posts: Types.ObjectId[]
  followers: Types.ObjectId[]
  admins: Types.ObjectId[]
}
