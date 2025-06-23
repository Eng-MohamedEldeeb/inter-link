import { NextFunction, Response } from 'express'
import { GuardActivator } from '../guards/can-activate.guard'
import { IRequest } from '../interface/IRequest.interface'
import { asyncHandler } from './async-handler.decorator'

export const applyGuardsActivator = (...activators: GuardActivator[]) => {
  return asyncHandler(
    async (req: IRequest, _: Response, next: NextFunction) => {
      for (const activator of activators) {
        await activator.canActivate(req)
      }
      return next()
    },
  )
}
