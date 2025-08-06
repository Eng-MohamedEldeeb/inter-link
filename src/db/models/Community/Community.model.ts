import { model, models } from 'mongoose'
import { CommunitySchema } from './Community.schema'

export const CommunityModel =
  models.Community ?? model('Community', CommunitySchema)
