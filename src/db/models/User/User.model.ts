import { model, models } from 'mongoose'
import { UserSchema } from './User.schema'

export const UserModel = models.User ?? model('User', UserSchema)
