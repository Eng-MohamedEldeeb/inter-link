import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types/enum/context-type.enum'
import { MongoId } from '../../types/db/db.types'

import {
  GraphQLParams,
  HttpParams,
} from '../../decorators/context/types/context-detector.types'

class NotificationAuthorization {
  protected profileId!: MongoId
  protected belongsTo!: MongoId

  protected readonly isTheOwner = () => {
    return this.belongsTo.equals(this.profileId)
  }

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP()
      const { _id: profileId } = req.profile
      const { belongsTo } = req.notifications

      this.profileId = profileId
      this.belongsTo = belongsTo

      return this.isTheOwner()
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL()
      const { _id: profileId } = context.profile
      const { belongsTo } = context.notifications

      this.profileId = profileId
      this.belongsTo = belongsTo

      return this.isTheOwner()
    }
  }
}

export default new NotificationAuthorization()
