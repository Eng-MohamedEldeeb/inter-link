import { model, models } from 'mongoose'
import { StorySchema } from './Story.schema'

export const StoryModel = models.Story ?? model('Story', StorySchema)
