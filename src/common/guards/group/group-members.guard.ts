import { ContextDetector } from "../../decorators/context/context-detector.decorator"
import { ContextType } from "../../decorators/context/types"
import { MongoId } from "../../types/db"
import { GuardActivator } from "../../decorators/guard/guard-activator.guard"
import { IUser } from "../../../db/interfaces/IUser.interface"

import { GraphQLParams, HttpParams } from "../../decorators/context/types"

import groupRepository from "../../repositories/concrete/group.repository"

class GroupMembersGuard extends GuardActivator {
  private readonly groupRepository = groupRepository
  private profileId!: MongoId
  private members!: MongoId[] | IUser[]

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP()

      const { members } = req.group
      const { _id: profileId } = req.profile

      this.profileId = profileId
      this.members = members
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL()

      const { members } = context.group
      const { _id: profileId } = context.profile

      this.profileId = profileId
      this.members = members
    }

    if (Ctx.type === ContextType.socketContext) {
      const { socket } = Ctx.switchToSocket()

      const { members } = socket.group
      const { _id: profileId } = socket.profile

      this.profileId = profileId
      this.members = members
    }

    return this.isExistedMember()
  }

  private isExistedMember = () => {
    return this.members.some(member => member._id.equals(this.profileId))
  }
}

export default new GroupMembersGuard()
