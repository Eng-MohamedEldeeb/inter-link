import { ContextType } from '../context/types'
import { ContextDetector } from '../context/context-detector.decorator'

import { onError } from './helpers/async-handler.helpers'

export const asyncHandler = (fn: Function) => {
  return async (...params: any[]) => {
    const Ctx = ContextDetector.detect(params)

    try {
      if (Ctx.type === ContextType.httpContext) {
        const { req, res, next } = Ctx.switchToHTTP()
        return await fn(req, res, next)
      }

      if (Ctx.type === ContextType.graphContext) {
        const { source, args, context, info } = Ctx.switchToGraphQL()
        return await fn(source, args, context, info)
      }

      if (Ctx.type === ContextType.socketContext) {
        const { socket, socketServerNext } = Ctx.switchToSocket()
        return await fn(socket, socketServerNext)
      }
    } catch (error) {
      return await onError(error, Ctx)
    }
  }
}
