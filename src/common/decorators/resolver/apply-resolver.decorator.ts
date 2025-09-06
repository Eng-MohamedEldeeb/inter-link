import { GraphQLResolveInfo } from 'graphql'
import { applyGuards } from '../guard/apply-guards.decorator'
import { asyncHandler } from '../async-handler/async-handler.decorator'

import { IContext, IResolveArgs } from '../../interface/IGraphQL.interface'

export const applyResolver = ({
  guards,
  middlewares,
  resolver,
}: IResolveArgs) => {
  return asyncHandler(
    async (_: any, args: any, context: IContext, __: GraphQLResolveInfo) => {
      if (guards?.length)
        await applyGuards(...guards).apply(this, [_, args, context, __])

      if (middlewares?.length)
        for (const middleware of middlewares) {
          await middleware(_, args, context, __)
        }

      return resolver(args, context)
    },
  )
}
