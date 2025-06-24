import { GraphQLError, GraphQLResolveInfo } from 'graphql'
import { IResolveArgs } from '../interface/IGraphQL.types'

export const applyResolver = <A = any, C = any>({
  resolver,
  applyGuards,
  applyMiddlewares,
}: IResolveArgs<A, C>) => {
  return async (_: any, args: A, context: C, __: GraphQLResolveInfo) => {
    try {
      if (applyGuards?.length)
        for (const guard of applyGuards) {
          context = await guard.canActivate(args, context)
        }

      if (applyMiddlewares?.length)
        for (const middleware of applyMiddlewares) {
          await middleware({ args, context })
        }

      return resolver(args, context)
    } catch (error) {
      console.log({ error })

      if (error instanceof Error) throw new GraphQLError(error.message)
    }
  }
}
