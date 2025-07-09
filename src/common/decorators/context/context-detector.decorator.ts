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

  static readonly detect = (params: any[]) => {
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

  static readonly switchToHTTP = <P = any, Q = any>(): HttpContext<P, Q> => {
    const [req, res, next]: HttpParams<P, Q> = this.params

    return { req, res, next }
  }

  static readonly switchToGraphQL = <Args = any>(): GraphQLContext<Args> => {
    const [source, args, context, info]: GraphQLParams<Args> = this.params

    return { source, args, context, info }
  }
}
