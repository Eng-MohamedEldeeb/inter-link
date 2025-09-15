import { MongoId } from "../../../../common/types/db"
import { IStoryInputs } from "../../../../db/interfaces/IStory.interface"

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

export interface ILikeStory extends IGetSingleStory {}
