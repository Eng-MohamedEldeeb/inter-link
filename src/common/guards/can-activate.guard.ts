export abstract class GuardActivator {
  abstract canActivate(
    ...args: any[any]
  ): Promise<any | boolean> | (any | boolean)
}
