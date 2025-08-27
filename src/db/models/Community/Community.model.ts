import { model, models } from 'mongoose'
import { communitySchema } from './Community.schema'

export const CommunityModel =
  models.Community ?? model('Community', communitySchema)
