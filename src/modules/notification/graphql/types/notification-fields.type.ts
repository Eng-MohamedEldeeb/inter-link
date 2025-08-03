import { GraphQLID, GraphQLInt, GraphQLList, GraphQLString } from 'graphql'

import {
  INotifications,
  INotificationSlice,
} from '../../../../db/interfaces/INotification.interface'

import {
  DateType,
  ObjFields,
} from '../../../../common/types/graphql/graphql.types'
import { returnedType } from '../../../../common/decorators/resolver/returned-type.decorator'
import { IUser } from '../../../../db/interfaces/IUser.interface'
import { cloudFile } from '../../../../common/services/upload/interface/cloud-response.interface'

const notificationFromDetails = returnedType<
  Pick<IUser, 'avatar' | 'fullName' | 'username' | '_id'>
>({
  name: 'notificationFromDetails',
  fields: {
    _id: { type: GraphQLID },
    avatar: {
      type: cloudFile,
    },
    fullName: { type: GraphQLString },
    username: { type: GraphQLString },
  },
})

const notificationDetailsFields = returnedType<
  Omit<INotificationSlice, '__v' | 'updatedAt'>
>({
  name: 'singleNotification',
  fields: {
    _id: { type: GraphQLID },
    from: { type: notificationFromDetails },
    title: { type: GraphQLString },
    refTo: { type: GraphQLString },
    sentAt: { type: GraphQLString },
    content: { type: GraphQLString },
    on: { type: GraphQLID },
    createdAt: { type: DateType },
  },
})

export const notificationFields: ObjFields<Omit<INotifications, '__v'>> = {
  _id: { type: GraphQLID },
  createdAt: { type: DateType },
  updatedAt: { type: DateType },

  belongsTo: { type: GraphQLID },

  missed: {
    type: new GraphQLList(notificationDetailsFields),
  },

  totalMissedNotifications: { type: GraphQLInt },

  missedMessages: {
    type: new GraphQLList(notificationDetailsFields),
  },

  seen: {
    type: new GraphQLList(notificationDetailsFields),
  },
}
