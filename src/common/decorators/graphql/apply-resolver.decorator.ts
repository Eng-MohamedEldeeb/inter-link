import { GraphQLResolveInfo } from 'graphql'
import { IResolveArgs } from '../../interface/graphql/IGraphQL.interface'
import { asyncHandler } from '../async-handler.decorator'
import { applyGuards } from '../apply-guards-activator.decorator'

export const applyResolver = <A = any, C = any>({
  resolver,
  guards,
  middlewares,
}: IResolveArgs<A, C>) => {
  return asyncHandler(
    async (_: any, args: A, context: C, __: GraphQLResolveInfo) => {
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
