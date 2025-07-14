import { MongoId } from '../../../common/types/db/db.types'
import { IStoryInputs } from '../../../db/interface/IStory.interface'

export interface IGetSingleStoryDTO {
  id: MongoId
}

export interface ICreateStoryDTO extends IStoryInputs {}

export interface IDeleteStoryDTO extends IGetSingleStoryDTO {}
