import {
  GraphQLFieldConfigArgumentMap,
  GraphQLOutputType,
  GraphQLResolveInfo,
} from 'graphql'
import { IUser } from '../../../db/models/interfaces/IUser.interface'
import { IPayload } from '../../utils/security/token/interface/token.interface'

export type Resolver<A = any, C = any> = (
  args: A,
  context: C,
) => Promise<any> | any

export type MiddlewareResolver<A = any, C = any> = (
  s: any,
  args: A,
  context: C,
  info: GraphQLResolveInfo,
) => Promise<any> | any

export interface IResolveArgs<A, C> {
  resolver: Resolver<A, C>
  applyMiddlewares?: MiddlewareResolver<A, C>[]
}

export interface IResolveController {
  type: GraphQLOutputType
  resolve: (s: any, args: any, context: any, info: any) => any
}

export interface IQueryController extends IResolveController {}

export interface IMutationController extends IResolveController {
  args: GraphQLFieldConfigArgumentMap
}

export interface ISuccessResponse {
  msg: string
  status: 200 | 201
  data?: any
}

export interface IContext {
  authorization: string
  user: IUser
  profile: IUser
  tokenPayload: IPayload
}
