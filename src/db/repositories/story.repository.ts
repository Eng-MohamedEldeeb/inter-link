import { IStory } from "../../db/interfaces/IStory.interface"
import { Model } from "mongoose"
import { DataBaseService } from "../db.service"
import { TStory } from "../../db/documents"
import { Story } from "../models"

class StoryRepository extends DataBaseService<IStory, TStory> {
  constructor(private readonly storyModel: Model<TStory> = Story.Model) {
    super(storyModel)
  }
}

export default new StoryRepository()
