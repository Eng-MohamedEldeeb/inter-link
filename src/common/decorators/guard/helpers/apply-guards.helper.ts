import { GuardActivator } from '../../../guards/can-activate.guard'
import { throwError } from '../../../handlers/error-message.handler'
import { ContextDetector } from '../../context/context-detector.decorator'

export const httpContextGuardsActivator = async (
  Ctx: typeof ContextDetector,
  guards: GuardActivator[],
) => {
  const { req, res, next } = Ctx.switchToHTTP()

  for (const guard of guards) {
    const result = await guard.canActivate(req, res, next)
    if (!result) return throwError({ msg: 'forbidden request', status: 403 })
  }

  return next()
}

export const graphQlContextGuardsActivator = async (
  Ctx: typeof ContextDetector,
  guards: GuardActivator[],
) => {
  const { source, args, context, info } = Ctx.switchToGraphQL()

  for (const guard of guards) {
    await guard.canActivate(source, args, context, info)

    if (!context) return throwError({ msg: 'forbidden request', status: 403 })
  }

  return context
}
