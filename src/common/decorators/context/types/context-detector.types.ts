import { IRequest } from '../../../interface/http/IRequest.interface'
import { NextFunction, Response } from 'express'
import { GraphQLResolveInfo } from 'graphql'
import { IContext } from '../../resolver/types/IGraphQL.interface'

export type HttpParams<P = any, Q = any> = [
  IRequest<P, Q>,
  Response,
  NextFunction,
]

export type HttpContext<P = any, Q = any> = {
  req: IRequest<P, Q>
  res: Response
  next: NextFunction
}

export type GraphQLParams<Args = any> = [
  any,
  Args,
  IContext,
  GraphQLResolveInfo,
]

export type GraphQLContext<Args = any> = {
  source: any
  args: Args
  context: IContext
  info: GraphQLResolveInfo
}
