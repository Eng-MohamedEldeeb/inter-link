import { NextFunction, Response } from 'express'
import { IRequest } from '../../interface/http/IRequest.interface'
import { ContextType } from '../enums/async-handler.types'
import { IContext } from '../../interface/graphql/IGraphQL.types'
import { GraphQLResolveInfo } from 'graphql'

export class ContextDetector {
  static type: ContextType
  protected static params: any[any]

  private static readonly isHttpParams = (params: any[]): boolean => {
    return (
      params.length === 3 &&
      'url' in params[0] &&
      params[params.length - 1] instanceof Function
    )
  }

  private static readonly isGraphQLParams = (params: any[]): boolean => {
    return params.length === 4 && 'fieldName' in params[3]
  }

  static readonly detect = (params: any[any]) => {
    this.params = params

    const isHttpParams = this.isHttpParams(params)

    const isGraphQLParams = this.isGraphQLParams(params)

    if (isHttpParams) {
      this.type = ContextType.httpContext
      return this
    }

    if (isGraphQLParams) {
      this.type = ContextType.graphContext
      return this
    }

    throw new Error('Un-known Context')
  }

  static readonly switchToHTTP = <P = any, Q = any>(): {
    req: IRequest<P, Q>
    res: Response
    next: NextFunction
  } => {
    const [req, res, next]: [IRequest<P, Q>, Response, NextFunction] =
      this.params

    return { req, res, next }
  }

  static readonly switchToGraphQL = <A = any, C = IContext>(): {
    source: any
    args: A
    context: C
    info: GraphQLResolveInfo
  } => {
    const [source, args, context, info]: [any, A, C, GraphQLResolveInfo] =
      this.params

    return { source, args, context, info }
  }
}
