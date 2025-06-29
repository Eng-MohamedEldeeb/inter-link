import { GraphQLResolveInfo } from 'graphql'
import { IResolveArgs } from '../../interface/graphql/IGraphQL.types'
import { asyncHandler } from '../async-handler.decorator'

export const applyResolver = <A = any, C = any>({
  resolver,
  applyMiddlewares,
}: IResolveArgs<A, C>) => {
  return asyncHandler(
    async (_: any, args: A, context: C, __: GraphQLResolveInfo) => {
      if (applyMiddlewares?.length)
        for (const middleware of applyMiddlewares) {
          await middleware(_, args, context, __)
        }

      return resolver(args, context)
    },
  )
}
