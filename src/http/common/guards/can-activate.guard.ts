import { IRequest } from '../../common/interface/IRequest.interface'

export abstract class GuardActivator {
  abstract canActivate(req: IRequest): Promise<Boolean> | Boolean
}
