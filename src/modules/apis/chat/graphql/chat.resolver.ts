// import chatService from "../chat.service"

// import {
//   IContext,
//   ISuccessResponse,
// } from "../../../common/interface/IGraphQL.interface"

// import { IDeleteMessage, ILikeMessage } from "../dto/chat.dto"

// class ChatQueryResolver {
//   private readonly chatService = chatService

//   public readonly getAllChats = async (
//     _: any,
//     context: IContext,
//   ): Promise<ISuccessResponse> => {
//     const { _id: profileId } = context.profile
//     return {
//       msg: "done",
//       status: 200,
//       data: await this.chatService.getAllChats(profileId),
//     }
//   }

//   public readonly getSingleChat = async (
//     _: any,
//     context: IContext,
//   ): Promise<ISuccessResponse> => {
//     return {
//       msg: "done",
//       status: 200,
//       data: context.chat,
//     }
//   }
// }

// class ChatMutationResolver {
//   private readonly chatService = chatService

//   public readonly likeMessage = async (
//     { messageId }: Pick<ILikeMessage, "messageId">,
//     context: IContext,
//   ): Promise<ISuccessResponse> => {
//     const profile = context.profile
//     const chat = context.chat

//     await this.chatService.likeMessage({
//       messageId,
//       chat,
//       profile,
//     })

//     return {
//       msg: "Liked the Message successfully",
//       status: 200,
//     }
//   }

//   public readonly deleteMessage = async (
//     { messageId }: Pick<IDeleteMessage, "messageId">,
//     context: IContext,
//   ): Promise<ISuccessResponse> => {
//     const { _id: chatId } = context.chat
//     const { _id: profileId } = context.profile

//     await this.chatService.deleteMessage({
//       chatId,
//       profileId,
//       messageId,
//     })

//     return {
//       msg: "Message is Deleted successfully",
//       status: 200,
//     }
//   }

//   public readonly deleteChat = async (
//     _: any,
//     context: IContext,
//   ): Promise<ISuccessResponse> => {
//     const { _id: profileId } = context.profile
//     const chat = context.chat

//     await this.chatService.deleteChat({
//       profileId,
//       chat,
//     })

//     return {
//       msg: "Chat is deleted successfully",
//       status: 200,
//     }
//   }
// }

// export const chatQueryResolver = new ChatQueryResolver()
// export const chatMutationResolver = new ChatMutationResolver()
