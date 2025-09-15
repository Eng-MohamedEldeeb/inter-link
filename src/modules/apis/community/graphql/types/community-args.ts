import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from "graphql"

import { argsType } from "../../../../../common/decorators/resolver/returned-type.decorator"

import * as DTO from "../../dto/community.dto"

export class CommunityArgs {
  public static readonly getCommunity = argsType<DTO.IGetCommunity>({
    communityId: { type: new GraphQLNonNull(GraphQLID) },
  })

  public static readonly create = argsType<
    Omit<DTO.ICreateCommunity, "cover" | "createdBy">
  >({
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    isPrivateCommunity: { type: GraphQLBoolean },
  })

  public static readonly join = argsType<
    Pick<DTO.IJoinCommunity, "communityId">
  >({
    communityId: { type: new GraphQLNonNull(GraphQLID) },
  })

  public static readonly leave = argsType<
    Pick<DTO.IJoinCommunity, "communityId">
  >({
    communityId: { type: new GraphQLNonNull(GraphQLID) },
  })

  public static readonly acceptJoinRequest = argsType<DTO.IAcceptJoinRequest>({
    communityId: { type: new GraphQLNonNull(GraphQLID) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  })

  public static readonly rejectJoinRequest = argsType<DTO.IRejectJoinRequest>({
    communityId: { type: new GraphQLNonNull(GraphQLID) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  })

  public static readonly kickOut = argsType<DTO.IRejectJoinRequest>({
    communityId: { type: new GraphQLNonNull(GraphQLID) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  })

  public static readonly edit = argsType<DTO.IEditCommunity>({
    communityId: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  })

  public static readonly addAdmin = argsType<DTO.IAddAdmin>({
    communityId: { type: new GraphQLNonNull(GraphQLID) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  })

  public static readonly removeAdmin = argsType<DTO.IRemoveAdmin>({
    communityId: { type: new GraphQLNonNull(GraphQLID) },
    adminId: { type: new GraphQLNonNull(GraphQLID) },
  })

  public static readonly deleteCommunity = argsType<DTO.IDeleteCommunity>({
    communityId: { type: new GraphQLNonNull(GraphQLID) },
  })

  public static readonly removePost = argsType<DTO.IRemovePost>({
    communityId: { type: new GraphQLNonNull(GraphQLID) },
    postId: { type: new GraphQLNonNull(GraphQLID) },
  })

  public static readonly changeVisibility =
    argsType<DTO.IChangeCommunityVisibility>({
      communityId: { type: new GraphQLNonNull(GraphQLID) },
    })
}
