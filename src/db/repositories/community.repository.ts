import { ICommunity } from "../../db/interfaces/ICommunity.interface"
import { Model } from "mongoose"
import { DataBaseService } from "../db.service"
import { TCommunity } from "../../db/documents"
import { Community } from "../models"

class CommunityRepository extends DataBaseService<ICommunity, TCommunity> {
  constructor(
    private readonly communityModel: Model<TCommunity> = Community.Model,
  ) {
    super(communityModel)
  }
}

export default new CommunityRepository()
