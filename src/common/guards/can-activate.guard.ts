export abstract class GuardActivator {
  abstract canActivate(
    ...params: any[any]
  ): Promise<any | boolean | void> | (any | boolean | void)
}
