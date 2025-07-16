import { ContextType } from './types/enum/context-type.enum'

import {
  GraphQLContext,
  GraphQLParams,
  HttpContext,
  HttpParams,
} from './types/context-detector.types'

export class ContextDetector {
  static type: ContextType
  protected static params: any[any]

  private static readonly hasHttpParams = (params: any[]): boolean => {
    return (
      params.length === 3 &&
      'url' in params[0] &&
      params[params.length - 1] instanceof Function
    )
  }

  private static readonly hasGraphQLParams = (params: any[]): boolean => {
    return params.length === 4 && 'fieldName' in params[3]
  }

  static readonly detect = (params: any[]) => {
    this.params = params

    const hasHttpParams = this.hasHttpParams(params)

    const hasGraphQLParams = this.hasGraphQLParams(params)

    if (hasHttpParams) {
      this.type = ContextType.httpContext
      return this
    }

    if (hasGraphQLParams) {
      this.type = ContextType.graphContext
      return this
    }

    throw new Error('Un-known Context')
  }

  static readonly switchToHTTP = <P = any, Q = any>(): HttpContext<P, Q> => {
    const [req, res, next]: HttpParams<P, Q> = this.params

    return { req, res, next }
  }

  static readonly switchToGraphQL = <Args = any>(): GraphQLContext<Args> => {
    const [source, args, context, info]: GraphQLParams<Args> = this.params

    return { source, args, context, info }
  }
}
