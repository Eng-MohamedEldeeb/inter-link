import { GuardActivator } from '../can-activate.guard'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types/enum/context-type.enum'
import { ICreateGroup, IGetGroup } from '../../../modules/group/dto/group.dto'
import { throwError } from '../../handlers/error-message.handler'

import {
  GraphQLParams,
  HttpParams,
} from '../../decorators/context/types/context-detector.types'

import groupRepository from '../../repositories/group.repository'

class GroupConflictedNameGuard extends GuardActivator {
  private readonly groupRepository = groupRepository
  protected name!: string

  protected readonly checkConflictedGroupNames = async (): Promise<boolean> => {
    const existedGroup = await this.groupRepository.findOne({
      filter: { name: this.name },
      projection: { _id: 1 },
      options: { lean: true },
    })
    if (existedGroup)
      return throwError({ msg: `'${this.name}' is and In-valid group name` })

    return true
  }

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetGroup, IGetGroup>()
      const { name }: ICreateGroup = req.body

      this.name = name

      return await this.checkConflictedGroupNames()
    }
  }
}

export default new GroupConflictedNameGuard()
