import { GuardActivator } from '../class/guard-activator.class'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types'
import { IGetCommunity } from '../../../modules/community/dto/community.dto'
import { throwError } from '../../handlers/error-message.handler'
import { MongoId } from '../../types/db'

import { GraphQLParams, HttpParams } from '../../decorators/context/types'

import communityRepository from '../../repositories/community.repository'

class CommunityExistenceGuard extends GuardActivator {
  protected readonly communityRepository = communityRepository
  protected communityId!: MongoId
  protected profileId!: MongoId
  protected createdBy!: MongoId

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetCommunity, IGetCommunity>()
      const { communityId } = { ...req.params, ...req.query }

      this.communityId = communityId

      req.community = await this.getCommunityInformation()
    }

    if (Ctx.type === ContextType.graphContext) {
      const { args, context } = Ctx.switchToGraphQL<IGetCommunity>()
      const { communityId } = args

      this.communityId = communityId

      context.community = await this.getCommunityInformation()
    }

    return true
  }

  protected readonly getCommunityInformation = async () => {
    const isExistedCommunity = await this.communityRepository.findOne({
      filter: { _id: this.communityId },
      populate: [{ path: 'posts', options: { sort: { createdAt: -1 } } }],
    })

    if (!isExistedCommunity)
      return throwError({
        msg: 'Un-Existed Community or In-valid Id',
        status: 404,
      })

    return isExistedCommunity
  }
}

export default new CommunityExistenceGuard()
