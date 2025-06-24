export abstract class GuardActivator<A = any, C = any> {
  abstract canActivate(args: A, context: C): Promise<C> | C
}
