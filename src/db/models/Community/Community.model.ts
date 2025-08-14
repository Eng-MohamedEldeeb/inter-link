import { model, models } from 'mongoose'
import { communitieschema } from './Community.schema'

export const CommunityModel =
  models.Community ?? model('Community', communitieschema)
