import { model, models } from 'mongoose'
import { CommentSchema } from './Comment.schema'

export const CommentModel = models.Comment ?? model('Comment', CommentSchema)
