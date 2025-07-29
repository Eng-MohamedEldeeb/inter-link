import { returnedType } from '../../../../common/decorators/resolver/returned-type.decorator'

import { groupFields } from './group-fields.type'

import { IGroup } from '../../../../db/interfaces/IGroup.interface'

export const singleGroup = returnedType<Omit<IGroup, '__v'>>({
  name: 'singleGroup',
  fields: groupFields,
})
export class GroupResponse {
  public static readonly getGroup = () => {
    return returnedType<Omit<IGroup, '__v'>>({
      name: 'getGroupResponse',
      fields: groupFields,
    })
  }
}
