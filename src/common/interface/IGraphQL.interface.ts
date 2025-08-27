import {
  GraphQLFieldConfigArgumentMap,
  GraphQLOutputType,
  GraphQLResolveInfo,
} from 'graphql'

import {
  INotificationInputs,
  INotifications,
} from '../../db/interfaces/INotification.interface'

import { GuardActivator } from '../decorators/guard/guard-activator.guard'
import { IPayload } from '../utils/security/token/interface/token.interface'
import { IUser } from '../../db/interfaces/IUser.interface'
import { IPost } from '../../db/interfaces/IPost.interface'
import { IComment } from '../../db/interfaces/IComment.interface'
import { IReply } from '../../db/interfaces/IReply.interface'
import { IStory } from '../../db/interfaces/IStory.interface'
import { ICommunity } from '../../db/interfaces/ICommunity.interface'
import { TChat, TGroup } from '../../db/documents'

export type ControllerParams = (
  args: any,
  context: IContext,
) => Promise<any> | any

export type ResolverParams = (
  source: any,
  args: any,
  context: IContext,
  info: GraphQLResolveInfo,
) => Promise<any> | any

export interface IResolveArgs {
  resolver: ControllerParams
  guards?: GuardActivator[]
  middlewares?: ResolverParams[]
}

export interface IResolver {
  type: GraphQLOutputType
  resolve: (
    s: any,
    args: any,
    context: IContext,
    info: GraphQLResolveInfo,
  ) => any
}

export interface IQueryController extends IResolver {
  args?: GraphQLFieldConfigArgumentMap
}

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
  tokenPayload: IPayload

  profile: IUser
  user: IUser
  story: IStory
  post: IPost
  comment: IComment
  reply: IReply
  community: ICommunity
  notifications: INotifications
  notification: Partial<INotificationInputs>
  chat: TChat
  group: TGroup
}
