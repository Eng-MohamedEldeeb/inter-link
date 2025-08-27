import { GuardActivator } from '../../decorators/guard/guard-activator.guard'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types'
import { throwError } from '../../handlers/error-message.handler'

import {
  ICreateCommunity,
  IGetCommunity,
} from '../../../modules/community/dto/community.dto'

import { GraphQLParams, HttpParams } from '../../decorators/context/types'

import communityRepository from '../../repositories/community.repository'

class CommunityConflictedNameGuard extends GuardActivator {
  protected readonly communityRepository = communityRepository
  protected name!: string

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetCommunity, IGetCommunity>()
      const { name }: ICreateCommunity = req.body

      this.name = name

      return await this.isValidCommunityName()
    }
  }

  protected readonly isValidCommunityName = async (): Promise<boolean> => {
    const existedCommunity = await this.communityRepository.findOne({
      filter: { name: this.name },
      projection: { _id: 1 },
      options: { lean: true },
    })
    if (existedCommunity)
      return throwError({
        msg: `'${this.name}' is and In-valid community name`,
      })

    return true
  }
}

export default new CommunityConflictedNameGuard()
