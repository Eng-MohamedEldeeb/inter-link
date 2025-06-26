import { NextFunction, Response } from 'express'
import { IRequest } from '../../interface/http/IRequest.interface'
import { ContextType } from '../types/async-handler.types'
import { IContext } from '../../interface/graphql/IGraphQL.types'
import { GraphQLResolveInfo } from 'graphql'

export class ContextDetector {
  static readonly detect = (params: any[any]): ContextType => {
    const paramsLength = params.length

    const httpParams =
      paramsLength == 3 &&
      'url' in params[0] &&
      params[paramsLength - 1] instanceof Function

    const graphParams = paramsLength === 4 && 'fieldName' in params[3]

    if (httpParams) return ContextType.httpContext

    if (graphParams) return ContextType.graphContext

    throw new Error('Un-known Context')
  }

  static readonly switchToHTTP = <P = any, Q = any>(
    params: any[any],
  ): { req: IRequest<P, Q>; res: Response; next: NextFunction } => {
    const [req, res, next]: [IRequest<P, Q>, Response, NextFunction] = params

    return { req, res, next }
  }

  static readonly switchToGraphQL = <A = any, C = IContext>(
    params: any[any],
  ): { source: any; args: A; context: C; info: GraphQLResolveInfo } => {
    const [source, args, context, info]: [any, A, C, GraphQLResolveInfo] =
      params

    return { source, args, context, info }
  }
}
