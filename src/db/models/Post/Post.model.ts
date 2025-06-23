import { model, models } from 'mongoose'
import { PostSchema } from './Post.schema'

export const PostModel = models.Post ?? model('Post', PostSchema)
