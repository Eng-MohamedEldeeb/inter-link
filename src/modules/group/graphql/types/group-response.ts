// import {
//   graphResponseType,
//   returnedType,
// } from "../../../../common/decorators/resolver/returned-type.decorator"

// import { allGroupChats, singleGroupChatFields } from "./group-fields"

// export class GroupResponse {
//   public static readonly getAllGroups = () => {
//     return graphResponseType({
//       name: "getAllGroupResponse",
//       data: returnedType({
//         name: "groupsDataResponse",
//         fields: {
//           chats: {
//             type: allGroupChats,
//           },
//         },
//       }),
//     })
//   }

//   public static readonly getSingleGroup = () => singleGroupChatFields
// }
