import { GuardActivator } from '../class/guard-activator.class'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types'
import { IGetGroup } from '../../../modules/group/dto/group.dto'
import { throwError } from '../../handlers/error-message.handler'
import { MongoId } from '../../types/db'

import { GraphQLParams, HttpParams } from '../../decorators/context/types'

import groupRepository from '../../repositories/group.repository'

class GroupExistenceGuard extends GuardActivator {
  protected readonly groupRepository = groupRepository
  protected groupId!: MongoId
  protected profileId!: MongoId
  protected createdBy!: MongoId

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetGroup, IGetGroup>()
      const { groupId } = { ...req.params, ...req.query }

      this.groupId = groupId

      req.group = await this.getGroupInformation()
    }

    if (Ctx.type === ContextType.graphContext) {
      const { args, context } = Ctx.switchToGraphQL<IGetGroup>()
      const { groupId } = args

      this.groupId = groupId

      context.group = await this.getGroupInformation()
    }

    return true
  }

  protected readonly getGroupInformation = async () => {
    const isExistedGroup = await this.groupRepository.findOne({
      filter: { _id: this.groupId },
      populate: [{ path: 'posts', options: { sort: { createdAt: -1 } } }],
    })

    if (!isExistedGroup)
      return throwError({
        msg: 'Un-Existed Group or In-valid Id',
        status: 404,
      })

    return isExistedGroup
  }
}

export default new GroupExistenceGuard()
