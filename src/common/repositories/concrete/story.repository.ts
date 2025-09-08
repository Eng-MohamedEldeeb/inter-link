import { IStory } from "../../../db/interfaces/IStory.interface"
import { Model } from "mongoose"
import { DataBaseService } from "../abstract/db-service.repository"
import { TStory } from "../../../db/documents"
import { StoryModel } from "../../../db/models/Story/Story.model"

class StoryRepository extends DataBaseService<IStory, TStory> {
  constructor(private readonly storyModel: Model<TStory> = StoryModel) {
    super(storyModel)
  }
}

export default new StoryRepository()
