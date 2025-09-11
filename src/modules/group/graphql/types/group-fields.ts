// import { GraphQLID, GraphQLInt, GraphQLList, GraphQLString } from 'graphql'

// import {
//   IChat,
//   IMessageDetails,
// } from '../../../../db/interfaces/IChat.interface'

// import { DateType } from '../../../../common/types/graphql/graphql.types'
// import { returnedType } from '../../../../common/decorators/resolver/returned-type.decorator'
// import { IGroup } from '../../../../db/interfaces/IGroup.interface'
// import {
//   userFields,
//   userProfileFields,
// } from '../../../../common/types/graphql/graphql-fields.types'
// import { singleFile } from '../../../../common/services/upload/interface/cloud-response.interface'

// const groupMessageDetails = returnedType<IMessageDetails>({
//   name: 'groupMessageDetails',
//   fields: {
//     from: { type: GraphQLID },
//     to: { type: GraphQLID },
//     message: { type: GraphQLString },
//     sentAt: { type: GraphQLString },
//   },
// })

// export const singleGroupChatFields = returnedType<
//   Omit<IGroup, '__v' | 'updatedAt'>
// >({
//   name: 'singleGroupChat',
//   fields: {
//     _id: { type: GraphQLID },
//     name: { type: GraphQLString },
//     cover: { type: singleFile },
//     description: { type: GraphQLString },

//     totalMembers: { type: GraphQLInt },
//     members: {
//       type: new GraphQLList(
//         returnedType({ name: 'groupChatMembers', fields: userProfileFields }),
//       ),
//     },

//     messages: { type: new GraphQLList(groupMessageDetails) },
//     createdBy: { type: GraphQLID },
//     createdAt: { type: DateType },
//   },
// })

// export const allGroupChats = new GraphQLList(singleGroupChatFields)
