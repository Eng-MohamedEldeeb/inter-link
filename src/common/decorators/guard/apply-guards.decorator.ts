import { asyncHandler } from '../async-handler/async-handler.decorator'
import { ContextDetector } from '../context/context-detector.decorator'
import { GuardActivator } from '../../guards/can-activate.guard'
import { ContextType } from '../context/types/enum/context-type.enum'

import {
  graphQlContextGuardsActivator,
  httpContextGuardsActivator,
  socketContextGuardsActivator,
} from './helpers/apply-guards.helper'
import { throwError } from '../../handlers/error-message.handler'

export const applyGuards = (guards: GuardActivator[]) => {
  return asyncHandler(async (...params: any[]) => {
    const Ctx = ContextDetector.detect(params)

    if (guards.length === 0)
      return throwError({
        msg: 'Guard Array Expected',
        details: { reason: 'applyGuards' },
        status: 500,
      })

    if (Ctx.type === ContextType.httpContext) {
      return await httpContextGuardsActivator(Ctx, guards)
    }

    if (Ctx.type === ContextType.graphContext) {
      return await graphQlContextGuardsActivator(Ctx, guards)
    }

    if (Ctx.type === ContextType.socketContext) {
      return await socketContextGuardsActivator(Ctx, guards)
    }
  })
}
