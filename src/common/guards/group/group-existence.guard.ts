import { GuardActivator } from '../can-activate.guard'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types/enum/context-type.enum'
import {
  GraphQLParams,
  HttpParams,
} from '../../decorators/context/types/context-detector.types'

import groupRepository from '../../repositories/group.repository'
import { IGetGroup } from '../../../modules/group/dto/group.dto'

import { throwError } from '../../handlers/error-message.handler'

class GroupExistenceGuard extends GuardActivator {
  private readonly groupRepository = groupRepository

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetGroup, IGetGroup>()
      const { id } = { ...req.params, ...req.query }

      const isExistedGroup = await this.groupRepository.findOne({
        filter: { _id: id },
      })

      if (!isExistedGroup)
        return throwError({
          msg: 'Un-Existed Group or In-valid Id',
          status: 404,
        })

      req.group = isExistedGroup
      return true
    }

    if (Ctx.type === ContextType.graphContext) {
      const { args, context } = Ctx.switchToGraphQL<IGetGroup>()
      const { id } = args

      const isExistedGroup = await this.groupRepository.findOne({
        filter: { _id: id },
      })

      if (!isExistedGroup)
        return throwError({
          msg: 'Un-Existed Group or In-valid Id',
          status: 404,
        })

      context.group = isExistedGroup
      return true
    }
  }
}

export default new GroupExistenceGuard()
