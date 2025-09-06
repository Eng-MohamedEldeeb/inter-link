import { GuardActivator } from '../guard-activator.guard'
import { throwError } from '../../../handlers/error-message.handler'
import { ContextDetector } from '../../context/context-detector.decorator'

export const httpContextGuardsActivator = async (
  ctx: typeof ContextDetector,
  guards: GuardActivator[],
) => {
  const { req, res, next } = ctx.switchToHTTP()

  for (const guard of guards) {
    const result = await guard.canActivate(req, res, next)
    if (!result) return throwError({ msg: 'forbidden request', status: 403 })
  }

  return next()
}

export const graphQlContextGuardsActivator = async (
  ctx: typeof ContextDetector,
  guards: GuardActivator[],
) => {
  const { source, args, context, info } = ctx.switchToGraphQL()

  for (const guard of guards) {
    const result = await guard.canActivate(source, args, context, info)
    if (!result) return throwError({ msg: 'forbidden request', status: 403 })
  }

  return context
}

export const socketContextGuardsActivator = async (
  ctx: typeof ContextDetector,
  guards: GuardActivator[],
) => {
  const { socket, socketServerNext } = ctx.switchToSocket()

  for (const guard of guards) {
    const result = await guard.canActivate(socket, socketServerNext)
    if (!result) return socketServerNext(new Error('forbidden request'))
  }

  return socketServerNext()
}
