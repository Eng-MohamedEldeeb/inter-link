import { Document, HydratedDocument } from 'mongoose'
import { IUser } from '../interfaces/IUser.interface'
import { IOtp } from '../interfaces/IOtp.interface'

export type TUser = HydratedDocument<IUser> & Document

export type TOtp = HydratedDocument<IOtp> & Document
