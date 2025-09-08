import { ICommunity } from "../../../db/interfaces/ICommunity.interface"
import { Model } from "mongoose"
import { DataBaseService } from "../abstract/db-service.repository"
import { TCommunity } from "../../../db/documents"
import { CommunityModel } from "../../../db/models/Community/Community.model"

class CommunityRepository extends DataBaseService<ICommunity, TCommunity> {
  constructor(
    private readonly communityModel: Model<TCommunity> = CommunityModel,
  ) {
    super(communityModel)
  }
}

export default new CommunityRepository()
