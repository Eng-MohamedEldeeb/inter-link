import { NextFunction, Response } from 'express'
import { IRequest } from '../interface/http/IRequest.interface'
import { asyncHandler } from './async-handler.decorator'
import { ContextDetector } from './context/context-detector.decorator'
import { ContextType } from './types/async-handler.types'
import { IContext } from '../interface/graphql/IGraphQL.types'
import { GraphQLResolveInfo } from 'graphql'
import { GuardActivator } from '../guards/can-activate.guard'
import { throwGraphError } from '../handlers/graphql/error.handler'
import { throwHttpError } from '../handlers/http/error-message.handler'

export const applyGuardsActivator = (...activators: GuardActivator[]) => {
  return asyncHandler(async (...params: any[any]) => {
    const contextType = ContextDetector.detect(params)

    if (contextType === ContextType.httpContext) {
      const { req, next } = ContextDetector.switchToHTTP(params)
      for (const activator of activators) {
        const result = await activator.canActivate(req)
        if (!result)
          return throwHttpError({ msg: 'forbidden request', status: 403 })
      }
      return next()
    }
    if (contextType === ContextType.graphContext) {
      console.log('entered graph')

      const { source, args, context, info } =
        ContextDetector.switchToGraphQL(params)
      let updatedContext = context

      for (const activator of activators) {
        updatedContext = await activator.canActivate(
          source,
          args,
          context,
          info,
        )
        if (!context) return throwGraphError('forbidden request')
      }
      return context
    }
  })
}
