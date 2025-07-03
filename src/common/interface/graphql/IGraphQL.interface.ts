import {
  GraphQLFieldConfigArgumentMap,
  GraphQLOutputType,
  GraphQLResolveInfo,
} from 'graphql'
import { IUser } from '../../../db/interface/IUser.interface'
import { IPayload } from '../../utils/security/token/interface/token.interface'
import { IPost } from '../../../db/interface/IPost.interface'
import { GuardActivator } from '../../guards/can-activate.guard'

export type ResolverParams<A = any, C = any> = (
  source: any,
  args: A,
  context: C,
  info: GraphQLResolveInfo,
) => Promise<any> | any

export type ControllerParams<A = any, C = any> = (
  args: A,
  context: C,
) => Promise<any> | any

export interface IResolveArgs<A, C> {
  resolver: ControllerParams<A, C>
  guards?: GuardActivator[]
  middlewares?: ResolverParams<A, C>[]
}

export interface IResolver {
  type: GraphQLOutputType
  resolve: (s: any, args: any, context: any, info: any) => any
}

export interface IQueryController extends IResolver {}

export interface IMutationController extends IResolver {
  args: GraphQLFieldConfigArgumentMap
}

export interface ISuccessResponse {
  msg: string
  status?: 200 | 201
  data?: any
}

export interface IContext {
  authorization: string
  user: IUser
  profile: IUser
  post: IPost
  tokenPayload: IPayload
}
