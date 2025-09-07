import {
  graphResponseType,
  returnedType,
} from "../../../../common/decorators/resolver/returned-type.decorator"

import { allChats, singleChatFields } from "./chat-fields"

export class ChatResponse {
  public static readonly getAllChats = () => {
    return graphResponseType({
      name: "getAllChatsResponse",
      data: returnedType({
        name: "chatsDataResponse",
        fields: {
          chats: {
            type: allChats,
          },
        },
      }),
    })
  }

  public static readonly getSingleChat = () => singleChatFields
}
