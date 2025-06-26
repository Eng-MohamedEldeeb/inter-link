export abstract class GuardActivator {
  abstract canActivate(
    ...params: any[any]
  ): Promise<any | boolean> | (any | boolean)
}
