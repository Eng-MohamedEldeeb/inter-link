import { GuardActivator } from '../class/guard-activator.class'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types'
import { throwError } from '../../handlers/error-message.handler'

import { ICreateGroup, IGetGroup } from '../../../modules/group/dto/group.dto'
import { GraphQLParams, HttpParams } from '../../decorators/context/types'

import groupRepository from '../../repositories/group.repository'

class GroupConflictedNameGuard extends GuardActivator {
  protected readonly groupRepository = groupRepository
  protected name!: string

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetGroup, IGetGroup>()
      const { name }: ICreateGroup = req.body

      this.name = name

      return await this.isValidGroupName()
    }
  }

  protected readonly isValidGroupName = async (): Promise<boolean> => {
    const existedGroup = await this.groupRepository.findOne({
      filter: { name: this.name },
      projection: { _id: 1 },
      options: { lean: true },
    })
    if (existedGroup)
      return throwError({ msg: `'${this.name}' is and In-valid group name` })

    return true
  }
}

export default new GroupConflictedNameGuard()
