import { GraphQLID, GraphQLInt, GraphQLList, GraphQLString } from "graphql"

import { INotification } from "../../../../../db/interfaces/INotification.interface"

import {
  DateType,
  ObjFields,
} from "../../../../../common/types/graphql/graphql.types"
import { returnedType } from "../../../../../common/decorators/resolver/returned-type.decorator"
import { IUser } from "../../../../../db/interfaces/IUser.interface"
import { cloudFile } from "../../../../../common/services/upload/interface/cloud-response.interface"

const notificationFromDetails = returnedType<
  Pick<IUser, "avatar" | "username" | "_id">
>({
  name: "notificationFromDetails",
  fields: {
    _id: { type: GraphQLID },
    avatar: {
      type: cloudFile,
    },
    username: { type: GraphQLString },
  },
})

export const notificationFields: ObjFields<Omit<INotification, "__v">> = {
  _id: { type: GraphQLID },
  createdAt: { type: DateType },
  updatedAt: { type: DateType },

  receiver: { type: GraphQLID },
  sender: { type: GraphQLID },
  relatedTo: { type: GraphQLID },

  message: { type: GraphQLString },
  ref: { type: GraphQLString },

  status: { type: GraphQLString },

  sentAt: { type: GraphQLString },
  seenAt: { type: DateType },
  receivedAt: { type: DateType },
  deletedAt: { type: DateType },
}

const notificationDetailsFields = returnedType<Omit<INotification, "__v">>({
  name: "singleNotification",
  fields: notificationFields,
})
