import { GraphQLID, GraphQLNonNull } from "graphql"

import * as DTO from "../../dto/chat.dto"

import { argsType } from "../../../../../common/decorators"

export class ChatArgs {
  public static readonly getSingleChat = argsType<DTO.IGetSingleChat>({
    chatId: { type: new GraphQLNonNull(GraphQLID) },
  })

  public static readonly likeMessage = argsType<Omit<DTO.ILikeMessage, "chat">>(
    {
      chatId: { type: new GraphQLNonNull(GraphQLID) },
      messageId: { type: new GraphQLNonNull(GraphQLID) },
    },
  )
  public static readonly deleteChat = argsType<Pick<DTO.IDeleteChat, "chatId">>(
    {
      chatId: { type: new GraphQLNonNull(GraphQLID) },
    },
  )
  public static readonly deleteMessage = argsType<
    Omit<DTO.IDeleteMessage, "chat">
  >({
    chatId: { type: new GraphQLNonNull(GraphQLID) },
    messageId: { type: new GraphQLNonNull(GraphQLID) },
  })
}
