import { ICloudFile } from "../../common/services/upload/interface/cloud-response.interface"
import { IMongoDoc } from "../../common/interface/IMongo-doc.interface"
import { MongoId } from "../../common/types/db"

export interface IStoryInputs {
  body: string
  createdBy: MongoId
  attachment: ICloudFile
}
export interface IStory extends IStoryInputs, IMongoDoc {
  viewers: MongoId[]
  totalViewers: number
  likedBy: MongoId[]
}
