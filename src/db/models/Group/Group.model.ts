import { model, models } from "mongoose"
import { GroupSchema } from "./Group.schema"

export const GroupModel = models.Group ?? model("Group", GroupSchema)
