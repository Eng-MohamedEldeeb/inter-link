import { Document, HydratedDocument } from 'mongoose'

import { IUser } from '../interfaces/IUser.interface'
import { IOtp } from '../interfaces/IOtp.interface'
import { ICommunity } from '../interfaces/ICommunity.interface'
import { IPost } from '../interfaces/IPost.interface'
import { IComment } from '../interfaces/IComment.interface'
import { IStory } from '../interfaces/IStory.interface'
import { INotifications } from '../interfaces/INotification.interface'
import { IChat } from '../interfaces/IChat.interface'
import { IChatGroup } from '../interfaces/IChatGroup.interface'

export type TOtp = HydratedDocument<IOtp> & Document

export type TUser = HydratedDocument<IUser> & Document

export type TPost = HydratedDocument<IPost> & Document

export type TStory = HydratedDocument<IStory> & Document

export type TComment = HydratedDocument<IComment> & Document

export type TCommunity = HydratedDocument<ICommunity> & Document

export type TNotification = HydratedDocument<INotifications> & Document

export type TChat = HydratedDocument<IChat> & Document

export type TChatGroup = HydratedDocument<IChatGroup> & Document
