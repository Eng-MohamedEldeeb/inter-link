import { MongoId } from '../../../common/types/db/db.types'
import { IStoryInputs } from '../../../db/interface/IStory.interface'

export interface IGetAllStory {
  userId: MongoId
}

export interface IGetSingleStory {
  id: MongoId
}

export interface IStoryId {
  storyId: MongoId
}

export interface ICreateStory extends IStoryInputs {}

export interface IDeleteStory extends IGetSingleStory {}
