import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types'
import { throwError } from '../../handlers/error-message.handler'
import { MongoId } from '../../types/db'
import { GuardActivator } from '../class/guard-activator.class'
import { TGroup } from '../../../db/documents'

import { GraphQLParams, HttpParams } from '../../decorators/context/types'

import groupRepository from '../../repositories/group.repository'
import { IGetSingleGroup } from '../../../modules/group/dto/group.dto'

class GroupExistenceGuard extends GuardActivator {
  protected readonly groupRepository = groupRepository
  protected profileId!: MongoId
  protected groupId!: string | MongoId

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<IGetSingleGroup, IGetSingleGroup>()

      const { id } = { ...req.params, ...req.query }

      if (!id)
        return throwError({ msg: 'group id is required in id query param' })

      this.groupId = id

      req.group = await this.getGroupDetails()
    }

    if (Ctx.type === ContextType.graphContext) {
      const { args, context } = Ctx.switchToGraphQL<IGetSingleGroup>()

      const { id } = args

      if (!id)
        return throwError({ msg: 'group id is required in id query param' })

      this.groupId = id

      context.group = await this.getGroupDetails()
    }

    if (Ctx.type === ContextType.socketContext) {
      const { socket } = Ctx.switchToSocket()

      const { id } = socket.handshake.query

      if (!id)
        return throwError({ msg: 'group id is required in id query param' })

      this.groupId = id as string

      socket.group = await this.getGroupDetails()
    }

    return true
  }

  protected readonly getGroupDetails = async (): Promise<TGroup> => {
    const groupDetails = await this.groupRepository.findOne({
      filter: { _id: this.groupId },
      populate: [
        {
          path: 'members',
          select: {
            _id: 1,
            username: 1,

            'avatar.secure_url': 1,
          },
          options: { lean: true },
        },
        {
          path: 'createdBy',
          select: {
            _id: 1,
            username: 1,

            'avatar.secure_url': 1,
          },
          options: { lean: true },
        },
      ],
    })

    if (!groupDetails)
      return throwError({
        msg: 'Un-Existed Group or In-valid Id',
        status: 404,
      })
    return groupDetails
  }
}

export default new GroupExistenceGuard()
