import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'
import { argsType } from '../../../../common/decorators/resolver/returned-type.decorator'
import { IDeleteGroup, IEditGroup, IGetGroup } from '../../dto/group.dto'

export const getGroup = argsType<IGetGroup>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})

export const edit = argsType<
  IGetGroup & Pick<IEditGroup, 'name' | 'description' | 'isPrivateGroup'>
>({
  id: { type: new GraphQLNonNull(GraphQLID) },
  name: { type: GraphQLString },
  description: { type: GraphQLString },
  isPrivateGroup: { type: GraphQLBoolean },
})

export const deleteGroup = argsType<IDeleteGroup>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})
