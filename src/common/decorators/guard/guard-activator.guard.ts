import { GraphQLParams, HttpParams, SocketServerParams } from '../context/types'

export abstract class GuardActivator {
  abstract canActivate(
    ...params: HttpParams | GraphQLParams | SocketServerParams
  ): Promise<any | boolean | void> | (any | boolean | void)
}
