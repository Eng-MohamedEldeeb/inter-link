import { GraphQLID, GraphQLNonNull } from "graphql"

import * as DTO from "../../dto/notification.dto"

import { argsType } from "../../../../../common/decorators/resolver/returned-type.decorator"

export const deleteNotification = argsType<DTO.IGetNotification>({
  id: { type: new GraphQLNonNull(GraphQLID) },
})
