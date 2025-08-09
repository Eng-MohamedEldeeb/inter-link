import {
  returnedResponseType,
  returnedType,
} from '../../../../common/decorators/resolver/returned-type.decorator'

import { allChats, singleChatFields } from './group-fields.type'

export class ChatResponse {
  public static readonly getAllChats = () => {
    return returnedResponseType({
      name: 'getAllChatsResponse',
      data: returnedType({
        name: 'chatsDataResponse',
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
