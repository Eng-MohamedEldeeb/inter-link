import { Document, HydratedDocument } from 'mongoose'

import { IUser } from '../interface/IUser.interface'
import { IOtp } from '../interface/IOtp.interface'
import { IGroup } from '../interface/IGroup.interface'
import { IPost } from '../interface/IPost.interface'
import { IComment } from '../interface/IComment.interface'
import { IStory } from '../interface/IStory.interface'

export type TOtp = HydratedDocument<IOtp> & Document

export type TUser = HydratedDocument<IUser> & Document

export type TPost = HydratedDocument<IPost> & Document

export type TStory = HydratedDocument<IStory> & Document

export type TComment = HydratedDocument<IComment> & Document

export type TGroup = HydratedDocument<IGroup> & Document
