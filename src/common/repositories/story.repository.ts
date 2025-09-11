import { IStory } from "../../db/interfaces/IStory.interface"
import { Model } from "mongoose"
import { DataBaseService } from "../services/db/db.service"
import { TStory } from "../../db/documents"
import { StoryModel } from "../../db/models/Story/Story.model"

class StoryRepository extends DataBaseService<IStory, TStory> {
  constructor(private readonly storyModel: Model<TStory> = StoryModel) {
    super(storyModel)
  }
}

export default new StoryRepository()
