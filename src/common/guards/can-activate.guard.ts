import {
  GraphQLParams,
  HttpParams,
} from '../decorators/context/types/context-detector.types'

export abstract class GuardActivator {
  abstract canActivate(
    ...params: HttpParams | GraphQLParams
  ): Promise<any | boolean | void> | (any | boolean | void)
}
