import {
  GraphQLFieldConfigArgumentMap,
  GraphQLOutputType,
  GraphQLScalarType,
} from 'graphql'
import { GuardActivator } from '../guards/can-activate.guard'
import { IUser } from '../../../db/models/interfaces/IUser.interface'
import { IPayload } from '../../../common/utils/security/token/interface/token.interface'

export type Resolver<A = any, C = any> = (
  args: A,
  context: C,
) => Promise<any> | any

export type MiddlewareResolver<A = any, C = any> = ({
  args,
  context,
}: {
  args: A
  context: C
}) => Promise<any> | any

export interface IResolveArgs<A, C> {
  resolver: Resolver<A, C>
  applyGuards?: GuardActivator[]
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
  tokenPayload: IPayload
}
