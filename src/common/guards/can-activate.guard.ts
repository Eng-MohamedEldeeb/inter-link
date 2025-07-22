import {
  GraphQLParams,
  HttpParams,
  SocketServerParams,
} from '../decorators/context/types/context-detector.types'

export abstract class GuardActivator {
  abstract canActivate(
    ...params: HttpParams | GraphQLParams | SocketServerParams
  ): Promise<any | boolean | void> | (any | boolean | void)
}
